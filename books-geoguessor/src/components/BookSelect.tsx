import React from 'react';
import { BookMeta } from '../types';
import { ArrowLeft } from 'lucide-react';

interface BookSelectProps {
  books: BookMeta[];
  onSelectBook: (book: BookMeta) => void;
  onBack: () => void;
}

export const BookSelect: React.FC<BookSelectProps> = ({ books, onSelectBook, onBack }) => {
  return (
    <div className="book-select-container">
      <div className="select-header">
        <button className="btn back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Назад</span>
        </button>
        <div className="select-title-group">
          <h1 className="select-h1">Выбор книги</h1>
          <p className="select-sub">Все 5 раундов матча будут по выбранному произведению</p>
        </div>
      </div>

      <div className="books-grid">
        {books.map(book => (
          <div
            key={book.id}
            className="typographic-book-card"
            onClick={() => onSelectBook(book)}
          >
            <div className="card-spine-decor"></div>
            <div className="card-inner-content">
              <div className="card-year-tag">{book.year}</div>
              <h2 className="card-book-title">{book.title}</h2>
              <p className="card-book-author">{book.author}</p>
              
              <div className="card-meta-footer">
                <span className="meta-words">~{Math.round(book.wordCount / 1000)}k слов</span>
                <span className="meta-play-action">Выбрать →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
