import { useState, useEffect } from "react";
const KEY = "f84fc31d";
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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies(): Promise<void> {
      try {
        setIsLoading(true);
        setError("");
        
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
          signal: controller.signal,
        });
    
        if (!res.ok) {
          throw new Error(`Failed to fetch movies. Status: ${res.status}`);
        }
    
        const data = await res.json();
    
        if (data.Response === "False") {
          throw new Error("No movies found for the given query.");
        }
    
        setMovies(data.Search);
        setError("");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err.message);
          setError("Error fetching movies. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();
    return (): void => {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
