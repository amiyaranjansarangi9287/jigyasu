import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import ContinueLearning from './ContinueLearning';
import LanguagePicker from './LanguagePicker';
import WorldsGrid from './WorldsGrid';
import SpacedRepetition from './SpacedRepetition';
import FeatureStrip from './FeatureStrip';
import HowItWorks from './HowItWorks';
import ParentsPanel from './ParentsPanel';
import Testimonials from './Testimonials';
import Footer from './Footer';
import PrivacyBanner from './PrivacyBanner';

function needsConsent() {
  try {
    return !localStorage.getItem('jigyasu-consent');
  } catch {
    return false;
  }
}

export default function LandingPage() {
  const [showPrivacy, setShowPrivacy] = useState(needsConsent);

  const handleAccept = () => {
    localStorage.setItem('jigyasu-consent', 'accepted');
    setShowPrivacy(false);
  };

  const handleDecline = () => {
    localStorage.setItem('jigyasu-consent', 'declined');
    setShowPrivacy(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <SpacedRepetition />
      <Hero />
      <ContinueLearning />
      <WorldsGrid />
      <FeatureStrip />
      <HowItWorks />
      <ParentsPanel />
      <Testimonials />
      <Footer />
      {/* Privacy Note Footer */}
      <footer className="w-full bg-slate-100 py-6 text-center text-slate-500 font-medium text-sm border-t border-slate-200">
        <p className="flex items-center justify-center gap-2">
          <span className="text-lg">🛡️</span> 
          <span><strong>Privacy First:</strong> We do not capture or store any personal data on our servers. Your nickname, avatar, and progress are saved securely on your own device.</span>
        </p>
      </footer>
      {showPrivacy && <PrivacyBanner onAccept={handleAccept} onDecline={handleDecline} />}
    </div>
  );
}
