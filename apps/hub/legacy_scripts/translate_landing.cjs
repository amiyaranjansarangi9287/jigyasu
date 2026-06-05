const fs = require('fs');

// LandingPage.tsx
let lpPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/landing/LandingPage.tsx';
let lpCode = fs.readFileSync(lpPath, 'utf8');
if (!lpCode.includes('import { useTranslation }')) {
  lpCode = lpCode.replace(/import PrivacyBanner from '\.\/PrivacyBanner';/, "import PrivacyBanner from './PrivacyBanner';\nimport { useTranslation } from 'react-i18next';");
}
if (!lpCode.includes('const { t } = useTranslation();')) {
  lpCode = lpCode.replace(/const \[showPrivacy, setShowPrivacy\] = useState\(needsConsent\);/, "const [showPrivacy, setShowPrivacy] = useState(needsConsent);\n  const { t } = useTranslation();");
}
lpCode = lpCode.replace(/<strong>Privacy First:<\/strong>/, "<strong>{t('landing_page.privacy_first', 'Privacy First:')}</strong>");
lpCode = lpCode.replace(/We do not capture or store any personal data on our servers\. Your nickname, avatar, and progress are saved securely on your own device\./, "{t('landing_page.privacy_desc', 'We do not capture or store any personal data on our servers. Your nickname, avatar, and progress are saved securely on your own device.')}");
fs.writeFileSync(lpPath, lpCode);


// Footer.tsx
let fPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/landing/Footer.tsx';
let fCode = fs.readFileSync(fPath, 'utf8');
fCode = fCode.replace(/Free visual STEM learning for every child in India\. Works offline\. 6 Indian languages\./, "{t('footer.desc', 'Free visual STEM learning for every child in India. Works offline. 6 Indian languages.')}");
fCode = fCode.replace(/>Information<\/p>/, ">{t('footer.information', 'Information')}</p>");
fCode = fCode.replace(/>Privacy<\/a>/, ">{t('footer.privacy', 'Privacy')}</a>");
fCode = fCode.replace(/>About Us<\/a>/, ">{t('footer.about', 'About Us')}</a>");
fCode = fCode.replace(/>Contact<\/p>/, ">{t('footer.contact', 'Contact')}</p>");
fCode = fCode.replace(/© \{new Date\(\)\.getFullYear\(\)\} Jigyasu\. Made with ❤️ for India\./, "© {new Date().getFullYear()} Jigyasu. {t('footer.made_with', 'Made with ❤️ for India.')}");
fs.writeFileSync(fPath, fCode);

// Testimonials.tsx
let tPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/landing/Testimonials.tsx';
let tCode = fs.readFileSync(tPath, 'utf8');
tCode = tCode.replace(/>Coming Soon<\/span>/, ">{t('testimonials.coming_soon', 'Coming Soon')}</span>");
tCode = tCode.replace(/Share Your Experience\s*<\/h2>/, "{t('testimonials.share_exp', 'Share Your Experience')}\n        </h2>");
tCode = tCode.replace(/We're building Jigyasu with love\. Once we launch, we'll feature real stories from learners and parents here\./, "{t('testimonials.building_with_love', 'We\\'re building Jigyasu with love. Once we launch, we\\'ll feature real stories from learners and parents here.')}");
tCode = tCode.replace(/>Ready to learn something today\?<\/h3>/, ">{t('testimonials.ready', 'Ready to learn something today?')}</h3>");
tCode = tCode.replace(/No sign-up\. No download required\. Open the app and start in your language in under 10 seconds\./, "{t('testimonials.no_signup', 'No sign-up. No download required. Open the app and start in your language in under 10 seconds.')}");
tCode = tCode.replace(/Pick your world →/, "{t('testimonials.pick_world', 'Pick your world →')}");
tCode = tCode.replace(/Get the app/, "{t('testimonials.get_app', 'Get the app')}");
fs.writeFileSync(tPath, tCode);

console.log('Updated landing components');
