import React, {  ReactNode, useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
import { useLocalStorageState } from "./useLocalStorageState";
import { useMovies } from "./useMovies";
interface AppProps { }
interface Movie {
  imdbID:  string;
  Title?: string;
  Year?: string;
  Poster?: string;
  Runtime?: string;
  imdbRating?: string;
  Plot?: string;
  Released?: string;
  Actors?: string;
  Director?: string;
  Genre?: string;
  // Add other properties as needed
}[]

interface WatchedMovie {
  year: ReactNode;
  imdbID: string;
  title: string;
  poster: string;
  imdbRating: number;
  userRating: number;
  runtime: number;
  countRatingDecisions: number;
}

interface MovieDetailsProps {
  selectedId: string;
  onCloseMovie: () => void;
  onAddWatched: (movie: WatchedMovie) => void;
  watched: WatchedMovie[];
}

const average = (arr: number[]): number =>
  arr.reduce((acc, cur) => acc + cur / arr.length, 0);

const KEY = "f84fc31d";

interface LoaderProps { }

const Loader: React.FC<LoaderProps> = () => <p className="loader">Loading...</p>;

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <p className="error">
    <span>⛔️</span> {message}
  </p>
);

interface NavBarProps {
  children: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ children }) => (
  <nav className="nav-bar">
    <Logo />
    {children}
  </nav>
);

interface LogoProps { }

const Logo: React.FC<LogoProps> = () => (
  <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
);

interface SearchProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({ query, setQuery }) => {
  const inputEl = useRef<HTMLInputElement>(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current?.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
};

interface NumResultsProps {
  movies: Movie[];
}

const NumResults: React.FC<NumResultsProps> = ({ movies }) => (
  <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
);

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => (
  <main className="main">{children}</main>
);

interface BoxProps {
  children: React.ReactNode;
}

const Box: React.FC<BoxProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
};

interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (id: string) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onSelectMovie }) => (
  <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
    ))}
  </ul>
);

interface MovieProps {
  movie: Movie;
  onSelectMovie: (id: string) => void;
}

const Movie: React.FC<MovieProps> = ({ movie, onSelectMovie }) => (
  <li onClick={() => onSelectMovie(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
);

const MovieDetails: React.FC<MovieDetailsProps> = ({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) => {
  const [movie, setMovie] = useState<Movie | (() => Movie)>(() => ({} as Movie)); 
   const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | string>("");

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = typeof movie === 'function' ? movie() : movie;
  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const handleAdd = () => {
    const newWatchedMovie: WatchedMovie = {
      imdbID: selectedId,
      title: title || "",
      year: year || "",
      poster: poster || "",
      imdbRating: Number(imdbRating),
      runtime: Number(runtime?.split(" ")[0]),
      userRating: Number(userRating),
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={(rating) => setUserRating(rating)}
                  />
                  {userRating  && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to list
                  </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};

interface WatchedSummaryProps {
  watched: WatchedMovie[];
}

const WatchedSummary: React.FC<WatchedSummaryProps> = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div >
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
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
       
      <p>
        <span>👎</span>
        <span>Action</span>
      </p>
      </div>
    </div>
  );
};

interface WatchedMoviesListProps {
  watched: WatchedMovie[];
  onDeleteWatched: (id: string) => void;
}

const WatchedMoviesList: React.FC<WatchedMoviesListProps> = ({
  watched,
  onDeleteWatched,
}) => (
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

interface WatchedMovieProps {
  movie: WatchedMovie;
  onDeleteWatched: (id: string) => void;
}

const WatchedMovie: React.FC<WatchedMovieProps> = ({ movie, onDeleteWatched }) => (
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
      <p>
        <span>📅</span>
        <span>{movie.year}</span>
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

// eslint-disable-next-line no-empty-pattern
export default function App({ }: AppProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState<WatchedMovie[]>([], "watched");

  const handleSelectMovie = (id: string) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatched = (movie: WatchedMovie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleDeleteWatched = (id: string) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
