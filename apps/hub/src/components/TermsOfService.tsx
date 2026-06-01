import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 pb-24 text-slate-800">
      <h1 className="text-4xl font-black mb-8 text-sky-600">{t('terms_of_service', 'Terms of Service')}</h1>
      
      <div className="space-y-6 text-lg">
        <section>
          <h2 className="text-2xl font-bold mb-3">{t('terms_acceptance', 'Acceptance of Terms')}</h2>
          <p>
            {t('terms_acceptance_text', 'By accessing or using Jigyasu, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('terms_acceptable_use', 'Acceptable Use Policy')}</h2>
          <p className="mb-2">{t('terms_acceptable_use_text', 'Jigyasu is an educational platform designed for children and adults. Users agree to:')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('terms_use_1', 'Use the platform solely for educational, non-commercial purposes.')}</li>
            <li>{t('terms_use_2', 'Not attempt to interfere with or disrupt the service or servers.')}</li>
            <li>{t('terms_use_3', 'Not use the platform in any way that violates applicable laws or regulations.')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('terms_content', 'Content Guidelines')}</h2>
          <p>
            {t('terms_content_text', 'All content provided on Jigyasu is for educational purposes. We strive to ensure accuracy, but we do not warrant that any content is entirely error-free. The content is provided "as is" without warranties of any kind.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('terms_liability', 'Limitation of Liability')}</h2>
          <p>
            {t('terms_liability_text', 'To the fullest extent permitted by law, Jigyasu shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('terms_termination', 'Termination')}</h2>
          <p>
            {t('terms_termination_text', 'We reserve the right to modify or discontinue the service at any time without notice. We may also terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('terms_governing_law', 'Governing Law')}</h2>
          <p>
            {t('terms_governing_law_text', 'These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('terms_contact', 'Contact Information')}</h2>
          <p>
            {t('terms_contact_text', 'For any questions about these Terms, please contact us at legal@jigyasu.app.')}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            For general inquiries: contact@jigyasu.app
          </p>
        </section>
      </div>
    </div>
  );
}
