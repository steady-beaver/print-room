import { useState, useEffect } from "react";
import axios from "axios";

const useTitleSearch = () => {
  const [titleSearch, setTitleSearch] = useState("");
  const [resultArr, setResultArr] = useState([]);
  const [resultPage, setResultPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const feedState = (data) => {

    if (data == null) {

      setResultArr([]);
      setResultPage(0);
      setTotalPage(0);
      setCurrentPage(0);
    } else {

      setResultArr(data.results);
      setResultPage(data.page);
      setCurrentPage(data.page);
      setTotalPage(data.total_pages);

      // console.log(data)
    }

    setLoading(false)
  };


//   on search title change through .search-area > form > input

  useEffect(() => {
    if (titleSearch === "") {
      feedState(null);
    }

    const st = setTimeout(async () => {
      if (titleSearch) {
        try {
          setLoading(true)
          const res = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY_V3}&language=en-US&query=${titleSearch}&page=1&include_adult=false`
          );
          const data = await res.data;
          feedState(data);
        } catch (error) {
          console.log(error);
          setLoading(false)
        }
      }
    }, 1000);

    return () => {
      clearTimeout(st);
    };
  }, [titleSearch]);


//   on page change through .page-navigation arrows 
  useEffect(() => {
    if (currentPage !== resultPage && titleSearch) {
      (async () => {
        try {
            setLoading(true)
          const res = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_KEY_V3}&language=en-US&query=${titleSearch}&page=${currentPage}&include_adult=false`
          );
          const data = await res.data;
          feedState(data);
        } catch (error) {
          console.log(error);
          setLoading(false)
        }
      })();
    }
  }, [currentPage]);

  const getPrevPage = () => {
    if (currentPage > 1) setCurrentPage((page) => page - 1);
  };

  const getNextPage = () => {
    if (currentPage < totalPage) setCurrentPage((page) => page + 1);
  };

  return [
    titleSearch, setTitleSearch,
    resultArr, setResultArr,
    resultPage, setResultPage,
    totalPage, setTotalPage,
    currentPage, getPrevPage, getNextPage,
    loading
  ];
};

export default useTitleSearch;
