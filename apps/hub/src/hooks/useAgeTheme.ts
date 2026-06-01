import { useUserProfile } from '@jigyasu/storage';

export function useAgeTheme() {
  const { profile } = useUserProfile();
  // Default to kid-friendly tier if no profile is set
  const ageTier = profile?.ageTier || '3-5';

  const isChild = ['3-5', '6-8', '9-12'].includes(ageTier);
  const isAdult = !isChild; // 13-17 and 18+

  return {
    isChild,
    isAdult,
    fontClass: isChild ? 'font-sans' : 'font-inter',
    roundedClass: isChild ? 'rounded-3xl' : 'rounded-xl',
    mascotEnabled: isChild,
  };
}
