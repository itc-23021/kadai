// pages/index.js
import React, { useState, useEffect, useRef } from 'react';
import MovieList from '../components/MovieList';
import MovieDetails from '../components/MovieDetails';
import styles from '../styles/styles.module.css'; // CSSモジュールをインポート

const Home = ({ popularMovies }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorDetails, setActorDetails] = useState(null);
  const [moviesToShow, setMoviesToShow] = useState(16);
  const moviesPerPage = 8;

  const [sortOption, setSortOption] = useState('popularity');

  const loader = useRef(null);

  useEffect(() => {
    if (selectedMovie) {
      fetchCast(selectedMovie.id);
      setSelectedActor(null);
    }
  }, [selectedMovie]);

  useEffect(() => {
    if (selectedActor) {
      fetchActorDetails(selectedActor.id);
    }
  }, [selectedActor]);

  const fetchCast = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await response.json();

      setCast(data.cast);
    } catch (error) {
      console.error('Error fetching cast:', error);
    }
  };

  const fetchActorDetails = async (actorId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/person/${actorId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await response.json();

      setActorDetails(data);
    } catch (error) {
      console.error('Error fetching actor details:', error);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setActorDetails(null);
  };

  const handleActorChange = (event) => {
    const actorId = event.target.value;
    const selected = cast.find((actor) => actor.id.toString() === actorId);

    setSelectedActor(selected);
    setActorDetails(null);
  };

  const handleLoadMore = () => {
    setMoviesToShow((prev) => prev + moviesPerPage);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleBackToMovieList = () => {
    setSelectedMovie(null);
    setSelectedActor(null);
    setActorDetails(null);
  };

  const showLoadMoreButton = moviesToShow < popularMovies.length;

  const sortMovies = () => {
    switch (sortOption) {
      case 'popularity':
        return [...popularMovies].sort((a, b) => b.popularity - a.popularity);
      case 'release_date':
        return [...popularMovies].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      case 'alphabetical':
        return [...popularMovies].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return popularMovies;
    }
  };

  const sortedMovies = sortMovies();

  return (
    <div>
      <h1>人気映画一覧</h1>

      <div>
        <button className={styles.botan} onClick={() => handleSortChange('popularity')}>人気の高い順</button>
        <button className={styles.botan} onClick={() => handleSortChange('release_date')}>公開日順</button>
        <button className={styles.botan} onClick={() => handleSortChange('alphabetical')}>アルファベット順</button>
      </div>

      {selectedMovie ? (
        <MovieDetails
          movie={selectedMovie}
          cast={cast}
          onSelectActor={handleActorChange}
          actorDetails={actorDetails}
          onBackToMovieList={handleBackToMovieList}
        />
      ) : (
        <MovieList movies={sortedMovies.slice(0, moviesToShow)} onSelectMovie={handleMovieClick} />
      )}

      {!selectedMovie && showLoadMoreButton && (
        <div>
          <button className={styles.botan} onClick={handleLoadMore} disabled={!showLoadMoreButton}>
            もっと見る
          </button>
        </div>
      )}
    </div>
  );
};

export async function getStaticProps() {
  try {
    const totalPages = 10;

    let allMovies = [];

    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}&language=ja&region=JP`
      );
      const data = await response.json();

      if (data.results) {
        allMovies = allMovies.concat(data.results);
      }
    }

    return {
      props: {
        popularMovies: allMovies,
      },
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return {
      props: {
        popularMovies: [],
      },
    };
  }
}

export default Home;

