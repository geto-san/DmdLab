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
    <div className="border border-[#ddd] rounded-2xl p-4 mb-6 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)] max-w-[600px]">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full rounded-xl mb-3"
        />
      )}

      <h2 className="text-xl mb-2">{title}</h2>

      <p className="text-[#666] text-[0.95rem] mb-3">
        {description}
      </p>

      <div className="text-[0.8rem] text-[#888] mb-3">
        By <strong>{author || 'Unknown'}</strong> • {new Date(date).toDateString()} • {category}
      </div>

      <div className="flex gap-[0.4rem] flex-wrap">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-indigo-100 px-[0.6rem] py-[0.3rem] rounded-xl text-xs text-blue-800"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ArticleCard;
