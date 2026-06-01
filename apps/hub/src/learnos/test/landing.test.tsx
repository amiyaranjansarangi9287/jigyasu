import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import OwlLogo from '../landing/OwlLogo';
import Header from '../landing/Header';
import FeatureStrip from '../landing/FeatureStrip';
import Footer from '../landing/Footer';

vi.mock('../store', () => ({
  useLearnerStore: () => ({
    language: 'en',
    setLanguage: vi.fn(),
    enterWorld: vi.fn(),
  }),
}));

describe('OwlLogo', () => {
  it('renders SVG with correct viewBox', () => {
    render(<OwlLogo size={40} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 64 64');
  });

  it('respects size prop', () => {
    const { container } = render(<OwlLogo size={50} />);
    const span = container.firstChild as HTMLElement;
    expect(span.style.width).toBe('50px');
    expect(span.style.height).toBe('50px');
  });
});

describe('Header', () => {
  it('renders LearnOS brand name', () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Header />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('LearnOS')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Header />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Worlds')).toBeInTheDocument();
    expect(screen.getByText('How it works')).toBeInTheDocument();
  });

  it('renders Start free CTA', () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <Header />
        </I18nextProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Start free')).toBeInTheDocument();
  });
});

describe('FeatureStrip', () => {
  it('renders all 4 features', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <FeatureStrip />
      </I18nextProvider>
    );
    expect(screen.getByText('Zero friction')).toBeInTheDocument();
    expect(screen.getByText('Works offline')).toBeInTheDocument();
    expect(screen.getByText('Privacy first')).toBeInTheDocument();
    expect(screen.getByText('6 languages')).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders LearnOS brand', () => {
    render(<Footer />);
    expect(screen.getByText('LearnOS')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year.toString()))).toBeInTheDocument();
  });
});
