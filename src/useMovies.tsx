// useMovies.tsx
import { useState, useEffect } from 'react';

const KEY = 'f84fc31d';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface MoviesState {
  movies: Movie[];
  isLoading: boolean;
  error: string;
}

export function useMovies(query: string): MoviesState {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies(): Promise<void> {
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error('Something went wrong with fetching movies');
        }

        const data = await res.json();
        if (data.Response === 'False') {
          throw new Error('Movie not found');
        }

        setMovies(data.Search);
        setError('');
      } catch (err:any) {
        if (err.name !== 'AbortError') {
      
          if (err.message === 'Movie not found') {
            setError('No movies found. Please try a different search.');
          } else {
            setError('Something went wrong with fetching movies.');
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovies();

    return (): void => {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
