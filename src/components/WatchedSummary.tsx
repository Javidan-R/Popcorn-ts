
// WatchedSummary.tsx
import  { FC } from 'react';
interface WatchedMovie {
    imdbRating: number;
    userRating: number;
    runtime: number;
    // Əlavə xüsusiyyətlər burada
  }
  
  interface WatchedSummaryProps {
    watched: WatchedMovie[];
  }
  

const WatchedSummary: FC<WatchedSummaryProps> = ({ watched }) => {
    const average = (arr: number[]): number => arr.reduce((acc, cur) => acc + cur / arr.length, 0);

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

export default WatchedSummary;