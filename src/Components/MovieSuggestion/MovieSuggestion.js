import React from "react";
import "./movie-suggestion.css";

const MovieSuggestion = ({movie, movieDetails}) => {
  return (
    <div 
      className={"movieSuggestion " + (movie.poster_path ? "selectable" : "unselectable")}
      onClick={() => movieDetails(movie)}>
      
      {movie.poster_path 
      ? ( <img height="100" src={"https://image.tmdb.org/t/p/w92/" + movie.poster_path} />) 
      : ( <div className="no-poster">No available poster</div> )}
      
      <div className="info">
        <div> {movie.title} </div>
        <div> {movie.release_date && movie.release_date.substring(0, 4)} </div>
      </div>

    </div>
  );
};

export default MovieSuggestion;
