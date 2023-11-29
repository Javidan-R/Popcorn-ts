    // types.ts
    export interface Movie {
        imdbID: string;
        title: string;
        year: string;
        poster: string;
        imdbRating: number;
        userRating: string;
        runtime: number;
    }
    
    export interface WatchedMovie extends Movie {
        countRatingDecisions: number;
    }
    
    export interface MovieListProps {
        movies: Movie[];
        onSelectMovie: (id: string) => void;
    }
    
    export interface WatchedMoviesListProps {
        watched: WatchedMovie[];
        onDeleteWatched: (id: string) => void;
    }
    
    export interface WatchedMovieProps {
        movie: WatchedMovie;
        onDeleteWatched: (id: string) => void;
    }
    
    export interface MovieDetailsProps {
        selectedId: string;
        onCloseMovie: () => void;
        onAddWatched: (movie: WatchedMovie) => void;
        watched: WatchedMovie[];
    }
    
    export interface UseKeyProps {
        key: string;
        action: () => void;
    }
    