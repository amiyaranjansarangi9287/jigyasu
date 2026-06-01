import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 pb-24 text-slate-800">
      <h1 className="text-4xl font-black mb-8 text-sky-600">{t('privacy_policy', 'Privacy Policy')}</h1>
      
      <div className="space-y-6 text-lg">
        <section>
          <h2 className="text-2xl font-bold mb-3">{t('privacy_intro', 'Introduction')}</h2>
          <p>
            {t('privacy_intro_text', 'Welcome to Jigyasu. We are committed to protecting your privacy and ensuring a safe educational environment for children. This Privacy Policy explains how we collect, use, and protect information across our platform. Our privacy practices are designed to align with the principles of the Children\'s Online Privacy Protection Act (COPPA) and the Digital Personal Data Protection Act (DPDP Act).')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('privacy_collection', 'Information We Collect')}</h2>
          <p className="mb-2">{t('privacy_collection_text', 'We only collect the absolute minimum information necessary to provide our educational service:')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('privacy_profile_data', 'Local Profile Data')}</strong>: {t('privacy_profile_data_text', 'Names, avatars, and learning progress are stored locally on your device. We do not transmit this data to our servers.')}</li>
            <li><strong>{t('privacy_analytics', 'Anonymous Analytics')}</strong>: {t('privacy_analytics_text', 'We use privacy-first, cookieless analytics (Plausible) to understand general usage patterns. No personally identifiable information (PII) is tracked or stored.')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('privacy_parent_rights', 'Parent/Guardian Rights')}</h2>
          <p className="mb-2">{t('privacy_parent_rights_text', 'We respect the rights of parents and guardians under child privacy laws. Parents have the right to:')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacy_right_review', 'Review any information we have collected from their child.')}</li>
            <li>{t('privacy_right_delete', 'Request deletion of their child\'s information (which can be done instantly by clearing local browser data or using the "Delete My Data" button in the app).')}</li>
            <li>{t('privacy_right_refuse', 'Refuse further collection or use of their child\'s information.')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('privacy_third_parties', 'Third-Party Services')}</h2>
          <p>
            {t('privacy_third_parties_text', 'We do not sell data to third parties, nor do we run advertisements. All third-party services we use (such as for basic site hosting and analytics) are strictly evaluated for their privacy compliance and are not permitted to use our users\' data for their own purposes.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('privacy_retention', 'Data Retention')}</h2>
          <p>
            {t('privacy_retention_text', 'Because learning data is stored locally on your device, it is retained until you clear your browser\'s local storage or explicitly delete the profile within the app. Anonymous aggregate analytics data is kept indefinitely to help us improve the platform.')}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t('privacy_contact', 'Contact Us')}</h2>
          <p>
            {t('privacy_contact_text', 'If you have any questions or concerns about this Privacy Policy, please contact us at privacy@jigyasu.app.')}
          </p>
        </section>
      </div>
    </div>
  );
}
