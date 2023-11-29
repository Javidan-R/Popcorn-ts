// MovieList.tsx
import React, { FC } from 'react';

import { Movie as MovieType } from '../useMovies';

interface MovieListProps {
  movies: MovieType[];
  onSelectMovie: (id: string) => void;
}

const MovieList: FC<MovieListProps> = ({ movies, onSelectMovie }) => (
  <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
    ))}
  </ul>
);

export default MovieList;