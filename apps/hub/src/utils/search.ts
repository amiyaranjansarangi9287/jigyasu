/**
 * Advanced Search Utility
 * Full-text search, filters, and autocomplete for learning content
 */

export interface SearchableItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  world: string;
  ageGroup: string;
  language: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in minutes
}

export interface SearchFilters {
  category?: string;
  world?: string;
  ageGroup?: string;
  language?: string;
  difficulty?: string;
  minDuration?: number;
  maxDuration?: number;
  tags?: string[];
}

export interface SearchResult {
  item: SearchableItem;
  score: number;
  highlights: {
    title?: string;
    description?: string;
  };
}

class AdvancedSearch {
  private index: Map<string, SearchableItem> = new Map();
  private searchHistory: string[] = [];

  /**
   * Index a searchable item
   */
  indexItem(item: SearchableItem): void {
    this.index.set(item.id, item);
  }

  /**
   * Index multiple items
   */
  indexItems(items: SearchableItem[]): void {
    items.forEach((item) => this.indexItem(item));
  }

  /**
   * Remove item from index
   */
  removeItem(id: string): void {
    this.index.delete(id);
  }

  /**
   * Tokenize text for search
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 0);
  }

  /**
   * Calculate relevance score
   */
  private calculateScore(
    item: SearchableItem,
    queryTokens: string[]
  ): number {
    let score = 0;
    const titleTokens = this.tokenize(item.title);
    const descriptionTokens = this.tokenize(item.description);
    const tagTokens = item.tags.map((tag) => tag.toLowerCase());

    // Title matches (highest weight)
    queryTokens.forEach((token) => {
      if (titleTokens.includes(token)) {
        score += 10;
      }
    });

    // Description matches (medium weight)
    queryTokens.forEach((token) => {
      if (descriptionTokens.includes(token)) {
        score += 5;
      }
    });

    // Tag matches (medium weight)
    queryTokens.forEach((token) => {
      if (tagTokens.includes(token)) {
        score += 7;
      }
    });

    // Exact phrase match bonus
    const query = queryTokens.join(' ');
    if (item.title.toLowerCase().includes(query)) {
      score += 20;
    }
    if (item.description.toLowerCase().includes(query)) {
      score += 10;
    }

    return score;
  }

  /**
   * Highlight matching text
   */
  private highlightText(text: string, queryTokens: string[]): string {
    let highlighted = text;
    queryTokens.forEach((token) => {
      const regex = new RegExp(`(${token})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });
    return highlighted;
  }

  /**
   * Apply filters to results
   */
  private applyFilters(results: SearchableItem[], filters: SearchFilters): SearchableItem[] {
    let filtered = [...results];

    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    if (filters.world) {
      filtered = filtered.filter((item) => item.world === filters.world);
    }

    if (filters.ageGroup) {
      filtered = filtered.filter((item) => item.ageGroup === filters.ageGroup);
    }

    if (filters.language) {
      filtered = filtered.filter((item) => item.language === filters.language);
    }

    if (filters.difficulty) {
      filtered = filtered.filter((item) => item.difficulty === filters.difficulty);
    }

    if (filters.minDuration !== undefined) {
      filtered = filtered.filter((item) => (item.duration || 0) >= filters.minDuration!);
    }

    if (filters.maxDuration !== undefined) {
      filtered = filtered.filter((item) => (item.duration || 0) <= filters.maxDuration!);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((item) =>
        filters.tags!.some((tag) => item.tags.includes(tag))
      );
    }

    return filtered;
  }

  /**
   * Perform full-text search
   */
  search(query: string, filters?: SearchFilters, limit: number = 20): SearchResult[] {
    const queryTokens = this.tokenize(query);
    
    if (queryTokens.length === 0) {
      return [];
    }

    // Add to search history
    this.addToHistory(query);

    // Get all items
    const allItems = Array.from(this.index.values());

    // Apply filters first
    const filteredItems = filters ? this.applyFilters(allItems, filters) : allItems;

    // Calculate scores
    const scoredResults: SearchResult[] = filteredItems.map((item) => ({
      item,
      score: this.calculateScore(item, queryTokens),
      highlights: {
        title: this.highlightText(item.title, queryTokens),
        description: this.highlightText(item.description, queryTokens),
      },
    }));

    // Filter out zero-score results
    const validResults = scoredResults.filter((result) => result.score > 0);

    // Sort by score descending
    validResults.sort((a, b) => b.score - a.score);

    // Return top results
    return validResults.slice(0, limit);
  }

  /**
   * Get autocomplete suggestions
   */
  autocomplete(query: string, limit: number = 5): string[] {
    const queryTokens = this.tokenize(query);
    
    if (queryTokens.length === 0) {
      return [];
    }

    const suggestions: Set<string> = new Set();

    for (const item of this.index.values()) {
      const titleTokens = this.tokenize(item.title);
      const tagTokens = item.tags.map((tag) => tag.toLowerCase());

      // Check title for matches
      titleTokens.forEach((token) => {
        if (token.startsWith(queryTokens[0])) {
          suggestions.add(token);
        }
      });

      // Check tags for matches
      tagTokens.forEach((token) => {
        if (token.startsWith(queryTokens[0])) {
          suggestions.add(token);
        }
      });
    }

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get popular search terms
   */
  getPopularTerms(limit: number = 10): string[] {
    const termCounts = new Map<string, number>();

    for (const item of this.index.values()) {
      const tokens = [...this.tokenize(item.title), ...item.tags];
      tokens.forEach((token) => {
        termCounts.set(token, (termCounts.get(token) || 0) + 1);
      });
    }

    const sorted = Array.from(termCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sorted.map(([term]) => term);
  }

  /**
   * Add query to search history
   */
  private addToHistory(query: string): void {
    const trimmed = query.trim().toLowerCase();
    if (trimmed && !this.searchHistory.includes(trimmed)) {
      this.searchHistory.unshift(trimmed);
      if (this.searchHistory.length > 20) {
        this.searchHistory.pop();
      }
    }
  }

  /**
   * Get search history
   */
  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const item of this.index.values()) {
      categories.add(item.category);
    }
    return Array.from(categories);
  }

  /**
   * Get all worlds
   */
  getWorlds(): string[] {
    const worlds = new Set<string>();
    for (const item of this.index.values()) {
      worlds.add(item.world);
    }
    return Array.from(worlds);
  }

  /**
   * Get all tags
   */
  getTags(): string[] {
    const tags = new Set<string>();
    for (const item of this.index.values()) {
      item.tags.forEach((tag) => tags.add(tag));
    }
    return Array.from(tags);
  }
}

// Singleton instance
export const advancedSearch = new AdvancedSearch();

/**
 * Hook for using advanced search in components
 */
export function useAdvancedSearch() {
  return {
    indexItem: (item: SearchableItem) => advancedSearch.indexItem(item),
    indexItems: (items: SearchableItem[]) => advancedSearch.indexItems(items),
    removeItem: (id: string) => advancedSearch.removeItem(id),
    search: (query: string, filters?: SearchFilters, limit?: number) =>
      advancedSearch.search(query, filters, limit),
    autocomplete: (query: string, limit?: number) =>
      advancedSearch.autocomplete(query, limit),
    getPopularTerms: (limit?: number) => advancedSearch.getPopularTerms(limit),
    getSearchHistory: () => advancedSearch.getSearchHistory(),
    clearSearchHistory: () => advancedSearch.clearSearchHistory(),
    getCategories: () => advancedSearch.getCategories(),
    getWorlds: () => advancedSearch.getWorlds(),
    getTags: () => advancedSearch.getTags(),
  };
}
