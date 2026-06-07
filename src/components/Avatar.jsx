import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../services/client';

const sizeClasses = {
  6: 'w-6 h-6 text-xs',
  8: 'w-8 h-8 text-xs',
  10: 'w-10 h-10 text-sm',
  11: 'w-11 h-11 text-sm',
  12: 'w-12 h-12 text-base',
  20: 'w-20 h-20 text-2xl',
};

export const Avatar = ({ src, name, size = 8, to, className = '' }) => {
  const [error, setError] = useState(false);

  const resolvedSrc = src && (src.startsWith('http') ? src : `${BASE_URL}${src}`);
  const initial = name?.charAt(0)?.toUpperCase() || 'U';

  const content = (
    <div
      className={`rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden ${sizeClasses[size] || sizeClasses[8]} ${className}`}
    >
      {resolvedSrc && !error ? (
        <img
          src={resolvedSrc}
          alt={name || 'avatar'}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        initial
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
