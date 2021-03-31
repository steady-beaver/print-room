import React, { useState, useEffect, useRef } from "react";
import "./search-styles.css";
import MovieSuggestion from "../MovieSuggestion/MovieSuggestion";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import useTitleSearch from "../../Hooks/useTitleSearch";
import ClipLoader from "react-spinners/ClipLoader";
import SelectedMovieView from './SelectedMovieView'
import { useLocation } from 'react-router-dom';

const Search = () => {
  const [
    titleSearch, setTitleSearch,
    resultArr, setResultArr,
    resultPage, setResultPage,
    totalPage, setTotalPage,
    currentPage, getPrevPage, getNextPage,
    loading,
  ] = useTitleSearch();


  const [selectedMovie, setSelectedMovie] = useState()
  const searchRef = useRef()
  const location = useLocation();

  useEffect(() => {
    //Runs submenu is clicked
    
    console.log(location)
    setSelectedMovie(null)
    setTitleSearch("")
  }, [location])

  useEffect(() => {
    searchRef.current.focus()
  }, [])

  const movieDetails = (movie) => {
    if (movie.poster_path) setSelectedMovie(movie)
    else return null
  };

  let selectedMovieView = null;

  if (selectedMovie)
    selectedMovieView = <SelectedMovieView selectedMovie={selectedMovie} handleBackBtn={() => setSelectedMovie(null)}/>
  else selectedMovieView = null;


  const searchView =
    (<div className={"search-view " + (resultArr.length ? "withResults" : "withoutResults")}>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search-input">Movie</label>
        <input type="text" ref={searchRef} name="search-input" id="search-input" value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} autoComplete="off" />
      </form>
      {resultArr.length ? <div className="search-output">

        {loading
          ? (
          <ClipLoader color="#154c9f" loading={loading} size={50} />
          
          ) : (
          <SimpleBar autoHide={false} >
            <ul>
              {totalPage ? resultArr.map((movie) => (
                <li key={movie.id}>
                  <MovieSuggestion movie={movie} movieDetails={movieDetails} />
                </li>))
                // when there is successful req (resultPage == 1) but its empty (totalPage == 0)
                : (resultPage === 1 && <span>Cannot find any titles</span>)
              }
            </ul>

            {/* Arrow buttons */}
            {totalPage > 1 && (
              <div className="page-navigation">
                <button className="btn secondary-red-btn" onClick={getPrevPage} disabled={resultPage == 1} > &lt; </button>
                <span className="btn secondary-red-btn page-counter">  {" "}  {resultPage} / {totalPage} {" "}  </span>
                <button className="btn secondary-red-btn" onClick={getNextPage} disabled={resultPage == totalPage} > &gt; </button>
              </div>
            )}
          </SimpleBar>
          )}
      </div> : ""}
    </div>)


  return (
    <>
      <div className="search-styles text-area">
        <h1>Search your titles</h1>
        <h4>Join the adventure with your design</h4>
      </div>

      <div className="search-styles dynamic-area ">

        {selectedMovie ? selectedMovieView : searchView}

      </div>
    </>
  );
};

export default Search;
