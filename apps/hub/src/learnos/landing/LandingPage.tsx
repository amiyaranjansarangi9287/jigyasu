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
import { useTranslation } from 'react-i18next';

function needsConsent() {
  try {
    return !localStorage.getItem('jigyasu-consent');
  } catch {
    return false;
  }
}

export default function LandingPage() {
  const [showPrivacy, setShowPrivacy] = useState(needsConsent);
  const { t } = useTranslation();

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
      {showPrivacy && <PrivacyBanner onAccept={handleAccept} onDecline={handleDecline} />}
    </div>
  );
}
