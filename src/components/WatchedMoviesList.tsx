// WatchedMoviesList.tsx
import React, { FC } from 'react';
import WatchedMovie from './WatchedMovie';

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

interface WatchedMoviesListProps {
  watched: WatchedMovie[];
  onDeleteWatched: (id: string) => void;
}

const WatchedMoviesList: FC<WatchedMoviesListProps> = ({ watched, onDeleteWatched }) => (
  <ul className="list">
    {watched.map((movie) => (
      <WatchedMovie
      movie={movie}
      key={movie.imdbID}
      onDeleteWatched={onDeleteWatched}
    />
    ))}
  </ul>
);

export default WatchedMoviesList;
