import React from 'react';

const ArticleCard = ({ article }) => {
  const {
    title,
    description,
    tags = [],
    author,
    category,
    image,
    date
  } = article;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '16px',
        padding: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        maxWidth: '600px'
      }}
    >
      {image && (
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            borderRadius: '12px',
            marginBottom: '0.75rem'
          }}
        />
      )}

      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h2>

      <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
        {description}
      </p>

      <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' }}>
        By <strong>{author || 'Unknown'}</strong> • {new Date(date).toDateString()} • {category}
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#e0e7ff',
              padding: '0.3rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              color: '#1e40af'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ArticleCard;
