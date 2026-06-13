import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { useTranslation } from 'react-i18next';

interface XPGainToastProps {
  amount: number;
  label?: string;
}

// Individual toast
function Toast({ amount, label }: XPGainToastProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 pointer-events-none transition-all duration-500",
      "animate-slideUp"
    )}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
        <span className="text-2xl">⚡</span>
        <div>
          <p className="font-bold text-lg">+{amount} XP</p>
          {label && <p className="text-xs text-purple-200">{label}</p>}
        </div>
      </div>
    </div>
  );
}

// XP toast manager — use this to show XP gains
export function useXPToast() {
  const [toasts, setToasts] = useState<{ id: number; amount: number; label?: string }[]>([]);
  let nextId = 0;

  const showXP = (amount: number, label?: string) => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, amount, label }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} amount={toast.amount} label={toast.label} />
      ))}
    </>
  );

  return { showXP, ToastContainer };
}

export default Toast;
