import { useNavigate } from 'react-router-dom';
import { Trans } from "react-i18next";

export function KidFriendlyNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-sky-50 p-4 sm:p-8 rounded-3xl m-4 border-4 border-sky-100">
      <div className="text-center max-w-md animate-fade-in">
        <div className="text-8xl mb-6 animate-bounce">🦚</div>
        <h2 className="text-4xl font-black text-sky-900 mb-4 tracking-tight">
          <Trans i18nKey="auto.kidfriendlynotfound.oops_lumo_is_lost">Oops! Lumo is Lost!</Trans>
                          </h2>
        <p className="text-xl text-sky-700 mb-8 font-medium leading-relaxed">
          <Trans i18nKey="auto.kidfriendlynotfound.the_page_you_re_looking_for_we">The page you're looking for went on an adventure and we can't find it.</Trans>
                          </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-sky-500 text-white rounded-full font-bold text-xl
                     shadow-xl shadow-sky-500/30 hover:bg-sky-600 hover:scale-105
                     transition-all duration-300"
        >
          <Trans i18nKey="auto.kidfriendlynotfound.let_s_go_home">Let's Go Home 🏠</Trans>
                          </button>
      </div>
    </div>
  );
}
