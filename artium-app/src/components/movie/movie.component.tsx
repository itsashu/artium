import { ReactElement } from "react";
import "./movie.component.css";

export type MoviePropsType = {
  poster: string;
  title: string;
  onClickCallback: () => void;
};

export const Movie = ({
  poster,
  title,
  onClickCallback,
}: MoviePropsType): ReactElement<MoviePropsType> => (
  <div className="movie" onClick={() => onClickCallback()}>
    <img src={poster} alt={poster} className="movie-icon" />
    <div className="movie-title">{title}</div>
  </div>
);
