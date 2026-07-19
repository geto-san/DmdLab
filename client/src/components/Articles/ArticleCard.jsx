const ArticleCard = ({ article }) => {
  const { title, description, tags = [], author, category, image, date } = article;

  return (
    <div className="group bg-white border border-black/8 rounded-2xl overflow-hidden mb-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(11,17,32,0.08)] hover:border-signal/30">
      {image ? (
        <div className="aspect-[16/9] overflow-hidden bg-paper-2">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-ink flex items-center justify-center">
          <span className="eyebrow text-signal-soft">{category || 'Article'}</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="eyebrow text-signal">{category}</span>
        </div>
        <h2 className="font-display font-semibold text-lg text-ink-text leading-snug mb-2 line-clamp-2">
          {title}
        </h2>
        <p className="text-muted text-[14px] leading-relaxed mb-3 line-clamp-2">
          {description}
        </p>
        <div className="text-[12px] text-muted-2 mb-3">
          By <span className="text-ink-text font-medium">{author || 'Unknown'}</span> · {new Date(date).toDateString()}
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag, index) => (
              <span key={index} className="bg-paper-2 px-2.5 py-1 rounded-full text-[11px] text-muted font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
