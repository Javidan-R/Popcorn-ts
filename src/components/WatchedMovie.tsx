// WatchedMovie.tsx
import React, { FC } from 'react';

interface WatchedMovieProps {
  movie: WatchedMovie;
  onDeleteWatched: (id: string) => void;
}

interface WatchedMovie {
  imdbID: string;
  title: string;
  year: string;
  poster: string;
  imdbRating: number;
  userRating: string;
  runtime: number;
  // Əlavə xüsusiyyətlər burada
}

const WatchedMovie: FC<WatchedMovieProps> = ({ movie, onDeleteWatched }) => (
  <li>
    <img src={movie.poster} alt={`${movie.title} poster`} />
    <h3>{movie.title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>

      <button
        className="btn-delete"
        onClick={() => onDeleteWatched(movie.imdbID)}
      >
        X
      </button>
    </div>
  </li>
);

export default WatchedMovie;
