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
  const [searchTerm, setSearchTerm] = useState('');

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

      const castInJapanese = data.cast.map(actor => ({
        ...actor,
        name: actor.name,
        profile_path: actor.profile_path,
      }));

      setCast(castInJapanese);
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

      const actorDetailsInJapanese = {
        ...data,
        name: data.name,
        gender: data.gender === 1 ? '女性' : '男性',
        birthday: data.birthday,
        place_of_birth: data.place_of_birth,
      };

      setActorDetails(actorDetailsInJapanese);
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

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const showLoadMoreButton = popularMovies && moviesToShow < popularMovies.length;

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

  const filterMovies = () => {
    return sortedMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortedMovies = sortMovies();
  const filteredMovies = filterMovies();

  return (
    <div>
        <div className={styles.buttonContainer}>
          <button className={styles.botan} onClick={() => handleSortChange('popularity')}>人気の高い順</button>
          <button className={styles.botan} onClick={() => handleSortChange('release_date')}>公開日順</button>
          <button className={styles.botan} onClick={() => handleSortChange('alphabetical')}>アルファベット順</button>
        </div>
      

      <h1>人気映画一覧</h1>

      {selectedMovie ? (
        <MovieDetails
          movie={selectedMovie}
          cast={cast}
          onSelectActor={handleActorChange}
          actorDetails={actorDetails}
          onBackToMovieList={handleBackToMovieList}
        />
      ) : (
        <div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="作品名を検索"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <MovieList movies={filteredMovies.slice(0, moviesToShow)} onSelectMovie={handleMovieClick} />
        </div>
      )}

      {!selectedMovie && showLoadMoreButton && (
        <div className={styles.buttonContainer}>
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

