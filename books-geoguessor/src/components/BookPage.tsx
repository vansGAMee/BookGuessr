import React from 'react';
import { BookMeta, BookExcerpt } from '../types';
import { Bookmark } from 'lucide-react';

interface BookPageProps {
  book: BookMeta;
  excerpt: BookExcerpt;
}

export const BookPage: React.FC<BookPageProps> = ({ book, excerpt }) => {
  // Split paragraphs cleanly
  const paragraphs = excerpt.text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="book-page-wrapper">
      <div className="book-page-card">
        <div className="page-bookmark-header">
          <div className="book-header-info">
            <h2 className="book-title-heading">{book.title}</h2>
            <p className="book-author-sub">{book.author}</p>
          </div>
          <div className="bookmark-ribbon" title="Закладка">
            <Bookmark size={20} />
          </div>
        </div>

        <div className="page-paper-content">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="page-paragraph">
              {p}
            </p>
          ))}
        </div>

        <div className="page-footer-decor">
          <div className="decor-line"></div>
          <span className="decor-symbol">❖</span>
          <div className="decor-line"></div>
        </div>
      </div>
    </div>
  );
};
