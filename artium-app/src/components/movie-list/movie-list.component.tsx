import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import {
  getMovieDetailsApi,
  getMovieListApi,
} from "../../services/api-services";
import {
  MovieDetailsHashMapType,
  MovieDetailsType,
  MovieType,
} from "../../types/movie.types";
import { MovieDetails } from "../movie-details/movie-details.component";
import { Movie } from "../movie/movie.component";
import "./movie-list.component.css";

export const MovieList = (): ReactElement => {
  const [movieList, setMovieList] = useState<MovieType[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [movieDetails, setMovieDetails] = useState<MovieDetailsHashMapType>({});
  const [showMovieDetails, setShowMovieDetails] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const listRef = useRef(null);
  const timer = useRef<null | ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (searchText && searchText.length > 2) loadMovieListDebounced(searchText);
  }, [searchText]);

  useEffect(() => {
    if (page > 1) appendMovieList(searchText, page);
  }, [page]);

  const getMovieList = useCallback(async (query: string, page: number = 1) => {
    try {
      setLoading(true);
      setError("");
      const list: any = await getMovieListApi(query, page);
      if (list.Search) {
        const result: MovieType[] = list.Search;
        setMovieList(result);
      } else {
        setError("Failed to fetch movie list");
      }
    } catch (e) {
      setError("Failed to fetch movie list");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMovieListDebounced = useCallback(
    (searchText: string) => {
      if (timer.current) clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        timer.current = null;
        getMovieList(searchText);
      }, 500);
    },
    [getMovieList]
  );

  const appendMovieList = useCallback(
    async (searchText: string, page: number = 1) => {
      try {
        setLoading(true);
        setError("");
        const list: any = await getMovieListApi(searchText, page);
        if (list.Search) {
          const movieListNextPage: MovieType[] = list.Search;
          setMovieList((prev) => prev.concat(movieListNextPage));
        } else {
          setError("Failed to fetch more movie list");
        }
      } catch (e) {
        setError("Failed to fetch more movie list");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const onClick = useCallback(
    async (imdbID: string) => {
      if (!movieDetails[imdbID]) {
        try {
          setLoading(true);
          setError("");
          const movie: MovieDetailsType = await getMovieDetailsApi(imdbID);
          setMovieDetails({ ...movieDetails, [imdbID]: movie });
        } catch (err) {
          setError("Failed to load Movie details");
        } finally {
          setLoading(false);
        }
      }
      setShowMovieDetails(imdbID);
    },
    [movieDetails]
  );

  const onBackClick = useCallback(() => {
    if (showMovieDetails) setShowMovieDetails("");
  }, [showMovieDetails]);

  const onScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      console.log(scrollTop + " " + clientHeight + " " + scrollHeight);
      if (scrollTop + clientHeight >= scrollHeight) {
        setPage(page + 1);
      }
    }
  }, [page]);

  return (
    <div className="container" ref={listRef} onScroll={onScroll}>
      <div className="title">
        {showMovieDetails ? (
          <>
            <i className="fa fa-arrow-left" onClick={onBackClick}>
              Back
            </i>
            Movie Details
          </>
        ) : (
          "Movie List"
        )}
      </div>
      <div className={showMovieDetails ? "display-none" : ""}>
        <input
          className="search"
          type="search"
          placeholder="Enter atlest 3 characters to search.."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        ></input>
        {error && <h1>{error}</h1>}
        {loading && <h1>Loading...</h1>}
        {!error && movieList && movieList.length > 0 && (
          <div className="movie-list">
            {movieList.map((movie: MovieType) => (
              <Movie
                title={movie.Title}
                poster={movie.Poster}
                onClickCallback={() => onClick(movie.imdbID)}
                key={movie.imdbID}
              />
            ))}
          </div>
        )}
      </div>
      <div className={showMovieDetails ? "" : "display-none"}>
        <MovieDetails {...movieDetails[showMovieDetails]} />
      </div>
    </div>
  );
};
