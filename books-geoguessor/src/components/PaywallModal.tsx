import React, { useState } from 'react';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onSkip: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onSkip }) => {
  const [subNotice, setSubNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubscribeClick = () => {
    setSubNotice(true);
    setTimeout(() => setSubNotice(false), 4000);
  };

  return (
    <div className="modal-backdrop">
      <div className="paywall-card">
        <div className="paywall-badge">
          <Crown size={28} className="crown-icon" />
        </div>

        <h2 className="paywall-title">20 бесплатных раундов сыграно!</h2>
        
        <p className="paywall-desc">
          Вы отлично справляетесь с угадыванием классики! Получите полный доступ без ограничений, новые книги и расширенные режимы.
        </p>

        <div className="paywall-features">
          <div className="feature-item">
            <Sparkles size={16} className="feature-star" />
            <span>Неограниченное число раундов</span>
          </div>
          <div className="feature-item">
            <Sparkles size={16} className="feature-star" />
            <span>Доступ к расширенной библиотеке</span>
          </div>
          <div className="feature-item">
            <Sparkles size={16} className="feature-star" />
            <span>Статистика и аналитика точности</span>
          </div>
        </div>

        {subNotice && (
          <div className="sub-notice-banner">
            ✨ Спасибо за интерес! Платная подписка появится в будущих обновлениях. Нажмите «Пропустить», чтобы продолжить бесплатную игру.
          </div>
        )}

        <div className="paywall-actions">
          <button className="btn primary-btn subscribe-btn" onClick={handleSubscribeClick}>
            <span>Получить подписку</span>
            <ArrowRight size={18} />
          </button>

          <button className="btn text-btn skip-btn" onClick={onSkip}>
            <span>Пропустить</span>
          </button>
        </div>
      </div>
    </div>
  );
};
