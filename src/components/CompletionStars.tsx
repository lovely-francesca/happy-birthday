interface CompletionStarsProps {
  stars: number;
  total?: number;
}

export function CompletionStars({ stars, total = 3 }: CompletionStarsProps) {
  return (
    <div className="stars" aria-label={`${stars} stelle su ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`stars__star${index < stars ? ' is-on' : ''}`}
          style={{ animationDelay: `${120 + index * 140}ms` }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}
