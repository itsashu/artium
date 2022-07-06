import { ReactElement } from "react";
import { MovieDetailsType } from "../../types/movie.types";
import "./movie-details.component.css";

export const MovieDetails = (props: MovieDetailsType): ReactElement => (
  <div className="movie-details-container">
    <img src={props.Poster} alt={props.Poster} className="movie-poster" />
    <div className="movie-details">
      <h3 className="movie-details-label">
        {props.Title} {props.Year}
      </h3>
      <div>
        <Details item="Genre" value={props["Genre"]} />
        {Object.keys(props).map((prop: string) => {
          if (!["Title", "Poster", "Year", "Ratings"].includes(prop)) {
            return (
              <Details
                item={prop}
                value={props[prop as keyof MovieDetailsType].toString()}
              />
            );
          }
        })}
      </div>
    </div>
  </div>
);

const Details = ({
  item,
  value,
}: {
  item: string;
  value: string;
}): ReactElement => (
  <div>
    <div className="movie-details-label">{item}:</div>
    <div className="movie-details-value">{value}</div>
  </div>
);
