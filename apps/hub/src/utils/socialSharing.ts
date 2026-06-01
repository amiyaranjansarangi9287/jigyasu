/**
 * Social Sharing Utilities
 * Share achievements, progress, and learning content on social platforms
 */

export interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

export interface ShareOptions {
  platforms?: ('twitter' | 'facebook' | 'whatsapp' | 'linkedin' | 'email')[];
  hashtags?: string[];
}

/**
 * Share content using Web Share API (native mobile sharing)
 */
export async function nativeShare(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (error) {
    console.error('Native share failed:', error);
    return false;
  }
}

/**
 * Share on Twitter/X
 */
export function shareOnTwitter(data: ShareData, hashtags: string[] = []): void {
  const text = encodeURIComponent(`${data.text} ${hashtags.map((tag) => `#${tag}`).join(' ')}`);
  const url = encodeURIComponent(data.url);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

/**
 * Share on Facebook
 */
export function shareOnFacebook(data: ShareData): void {
  const url = encodeURIComponent(data.url);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

/**
 * Share on WhatsApp
 */
export function shareOnWhatsApp(data: ShareData): void {
  const text = encodeURIComponent(`${data.text} ${data.url}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

/**
 * Share on LinkedIn
 */
export function shareOnLinkedIn(data: ShareData): void {
  const url = encodeURIComponent(data.url);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

/**
 * Share via Email
 */
export function shareViaEmail(data: ShareData): void {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(`${data.text}\n\n${data.url}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Generate share URL for a platform
 */
export function generateShareUrl(platform: string, data: ShareData): string {
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;
    default:
      return data.url;
  }
}

/**
 * Copy share URL to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate achievement share data
 */
export function generateAchievementShareData(achievement: {
  title: string;
  description: string;
  xpReward: number;
}): ShareData {
  return {
    title: `I earned ${achievement.title} on Jigyasu!`,
    text: `I just unlocked "${achievement.title}" on Jigyasu - ${achievement.description}. Earned ${achievement.xpReward} XP! 🎉`,
    url: 'https://jigyasu.app',
  };
}

/**
 * Generate progress share data
 */
export function generateProgressShareData(progress: {
  modulesCompleted: number;
  xp: number;
  streak: number;
}): ShareData {
  return {
    title: 'My Jigyasu Learning Progress',
    text: `I've completed ${progress.modulesCompleted} modules, earned ${progress.xp} XP, and maintained a ${progress.streak}-day streak on Jigyasu! 📚`,
    url: 'https://jigyasu.app',
  };
}

/**
 * Generate module share data
 */
export function generateModuleShareData(module: {
  name: string;
  description: string;
  world: string;
}): ShareData {
  return {
    title: `Check out ${module.name} on Jigyasu`,
    text: `I'm learning about ${module.name} in the ${module.world} world on Jigyasu. ${module.description}`,
    url: 'https://jigyasu.app',
  };
}

/**
 * Generate wonder moment share data
 */
export function generateWonderMomentShareData(concept: string): ShareData {
  return {
    title: 'Wonder Moment on Jigyasu',
    text: `I just had a wonder moment learning about ${concept} on Jigyasu! The feeling of understanding is amazing! ✨`,
    url: 'https://jigyasu.app',
  };
}

/**
 * Social Share Component Data
 */
export interface SocialShareButton {
  platform: string;
  icon: string;
  label: string;
  action: (data: ShareData) => void;
}

export const socialShareButtons: SocialShareButton[] = [
  {
    platform: 'twitter',
    icon: '𝕏',
    label: 'Twitter',
    action: (data) => shareOnTwitter(data),
  },
  {
    platform: 'facebook',
    icon: '📘',
    label: 'Facebook',
    action: (data) => shareOnFacebook(data),
  },
  {
    platform: 'whatsapp',
    icon: '💬',
    label: 'WhatsApp',
    action: (data) => shareOnWhatsApp(data),
  },
  {
    platform: 'linkedin',
    icon: '💼',
    label: 'LinkedIn',
    action: (data) => shareOnLinkedIn(data),
  },
  {
    platform: 'email',
    icon: '✉️',
    label: 'Email',
    action: (data) => shareViaEmail(data),
  },
];

/**
 * Check if native sharing is available
 */
export function isNativeShareAvailable(): boolean {
  return typeof navigator.share !== 'undefined';
}

/**
 * Share content with platform selection
 */
export async function shareContent(
  data: ShareData,
  options: ShareOptions = {}
): Promise<boolean> {
  // Try native share first (best experience on mobile)
  if (isNativeShareAvailable()) {
    const success = await nativeShare(data);
    if (success) return true;
  }

  // Fallback to platform-specific sharing
  const platforms = options.platforms || ['twitter', 'facebook', 'whatsapp'];
  const hashtags = options.hashtags || ['Jigyasu', 'Learning', 'Education'];

  // For simplicity, just open the first available platform
  // In a real app, you'd show a modal with platform options
  if (platforms.includes('twitter')) {
    shareOnTwitter(data, hashtags);
    return true;
  }

  if (platforms.includes('facebook')) {
    shareOnFacebook(data);
    return true;
  }

  if (platforms.includes('whatsapp')) {
    shareOnWhatsApp(data);
    return true;
  }

  return false;
}
