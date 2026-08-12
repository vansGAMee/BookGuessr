import React from 'react';
import { BookMeta } from '../types';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  books: BookMeta[];
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, books, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="about-modal-card" onClick={e => e.stopPropagation()}>
        <div className="about-header">
          <div className="about-title-group">
            <h2 className="about-title">О проекте BookGuessr</h2>
            <p className="about-subtitle">Литературный GeoGuessr по русской классике</p>
          </div>
          <button className="icon-btn close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="about-body">
          <section className="about-section">
            <h3>Как играть?</h3>
            <p>
              Вам показывается случайная страница из классического произведения. Задача — по событиям, именам персонажей и атмосфере сюжета угадать, в каком месте книги находилась эта страница.
            </p>
            <p>
              Шкала отображает 0% (самое начало романа) — 100% (финал). Чем точнее ваш выбор, тем больше очков вы получаете (до 5000 за раунд).
            </p>
          </section>

          <section className="about-section">
            <div className="section-title-with-icon">
              <ShieldCheck size={18} className="shield-icon" />
              <h3>Источники текстов и авторские права</h3>
            </div>
            <p>
              Все тексты в игре находятся в <strong>общественном достоянии (Public Domain)</strong> и не охраняются авторским правом. Тексты получены из открытых легальных архивов Викитеки и Проекта Гутенберг.
            </p>
          </section>

          <section className="about-section">
            <h3>Библиотека произведений в MVP</h3>
            <div className="source-list">
              {books.map(b => (
                <div key={b.id} className="source-item">
                  <div className="source-book-info">
                    <span className="source-title">{b.title}</span>
                    <span className="source-author">{b.author} ({b.year})</span>
                  </div>
                  <a
                    href={b.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    <span>{b.sourceName}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="about-footer">
          <span>Сделано с любовью к классической литературе</span>
          <button className="btn primary-btn close-action-btn" onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
