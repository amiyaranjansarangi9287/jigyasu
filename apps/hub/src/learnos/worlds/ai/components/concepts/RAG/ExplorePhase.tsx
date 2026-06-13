import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { cn } from '../../../utils/cn';

interface ExplorePhaseProps {
  onComplete: () => void;
}

const library = [
  { id: 1, title: "Samosa Recipe", content: "Make samosa dough with flour, oil, and water. Fill with spiced potatoes and peas. Deep fry until golden brown and crispy.", tags: ["food", "cooking", "samosa"] },
  { id: 2, title: "Solar System", content: "Our solar system has 8 planets. Mercury is closest to the Sun, Neptune is farthest. Earth is the only planet known to have life.", tags: ["space", "planets", "science"] },
  { id: 3, title: "Dog Care Guide", content: "Dogs need daily walks, fresh water, and balanced meals. Most dogs should visit the vet yearly. Training works best with positive reinforcement.", tags: ["pets", "dogs", "animals"] },
  { id: 4, title: "Coding Basics", content: "Programming is giving instructions to computers. Python is great for beginners. Practice makes perfect - start with small projects!", tags: ["coding", "computers", "learning"] },
  { id: 5, title: "Ocean Facts", content: "Oceans cover 71% of Earth. The Mariana Trench is the deepest point. Coral reefs are home to 25% of all marine species.", tags: ["ocean", "nature", "science"] },
  { id: 6, title: "Healthy Snacks", content: "Great healthy snacks include fruits, nuts, yogurt, and vegetables with hummus. Avoid too much sugar and processed foods.", tags: ["food", "health", "snacks"] },
];

const searchQueries = [
  { query: "How do I make samosa?", matchIds: [1] },
  { query: "Tell me about planets", matchIds: [2] },
  { query: "How to take care of my pet dog?", matchIds: [3] },
  { query: "What lives in the ocean?", matchIds: [5] },
  { query: "What food is healthy?", matchIds: [6, 1] },
];

export default function ExplorePhase({ onComplete }: ExplorePhaseProps) {
  const { t } = useTranslation();
  const [selectedQuery, setSelectedQuery] = useState<number | null>(null);
  const [customQuery, setCustomQuery] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState("");
  const [hasExplored, setHasExplored] = useState(false);

  const performSearch = async (_query: string, matchIds: number[]) => {
    setIsSearching(true);
    setSearchResults([]);
    setGeneratedAnswer("");
    
    // Simulate search animation
    await new Promise(r => setTimeout(r, 500));
    
    // Show results one by one
    for (const id of matchIds) {
      await new Promise(r => setTimeout(r, 300));
      setSearchResults(prev => [...prev, id]);
    }
    
    await new Promise(r => setTimeout(r, 500));
    
    // Generate answer based on found documents
    const foundDocs = library.filter(doc => matchIds.includes(doc.id));
    const answer = `Based on my search, I found: ${foundDocs.map(d => d.content).join(" ")}`;
    setGeneratedAnswer(answer);
    setIsSearching(false);
    setHasExplored(true);
  };

  const handleQuerySelect = (index: number) => {
    setSelectedQuery(index);
    const q = searchQueries[index];
    performSearch(q.query, q.matchIds);
  };

  const handleCustomSearch = () => {
    if (!customQuery.trim()) return;
    
    // Simple keyword matching for custom queries
    const lowerQuery = customQuery.toLowerCase();
    const matches = library.filter(doc => 
      doc.tags.some(tag => lowerQuery.includes(tag)) ||
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().split(" ").some(word => lowerQuery.includes(word))
    );
    
    const matchIds = matches.length > 0 ? matches.map(d => d.id) : [library[Math.floor(Math.random() * library.length)].id];
    performSearch(customQuery, matchIds);
    setSelectedQuery(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
          <h2 className="text-2xl font-bold">🧸 RAG Library Explorer</h2>
          <p className="text-green-100 mt-1">{t('auto.learning.s927_search_the_library_and_see_rag_in_action', 'Search the library and see RAG in action!')}</p>
        </div>

        <div className="p-6">
          {/* Query Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auto.learning.s928_try_a_question', 'Try a question:')}</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuerySelect(i)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    selectedQuery === i
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-green-100"
                  )}
                >
                  "{q.query}"
                </button>
              ))}
            </div>
            
            {/* Custom Query */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Or type your own question..."
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSearch()}
              />
              <button
                onClick={handleCustomSearch}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all"
              >🔍 Search</button>
            </div>
          </div>

          {/* Library */}
          <div className="bg-slate-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">📚 Document Library</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {library.map((doc) => {
                const isMatch = searchResults.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all",
                      isMatch 
                        ? "border-green-500 bg-green-50 shadow-md scale-[1.02]"
                        : isSearching 
                        ? "border-gray-200 bg-white opacity-50"
                        : "border-gray-200 bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{doc.title}</span>
                      {isMatch && <span className="text-green-500">✓ Retrieved</span>}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{doc.content}</p>
                    <div className="flex gap-1 mt-2">
                      {doc.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generated Answer */}
          {generatedAnswer && (
            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-green-800 mb-2">🤖 RAG-Generated Answer:</h3>
              <p className="text-green-700">{generatedAnswer}</p>
            </div>
          )}

          {/* Searching Animation */}
          {isSearching && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-green-600">
                <div className="animate-spin w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
                <span>{t('auto.learning.s929_searching_library', 'Searching library...')}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onComplete}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all",
                hasExplored
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gray-200 text-gray-500"
              )}
            >Ready to Play! 🎮</button>
          </div>
        </div>
      </div>
    </div>
  );
}
