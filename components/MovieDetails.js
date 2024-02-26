// MovieDetails.js
import React, { useState, useEffect } from 'react';
import styles from '../styles/styles.module.css';

const MovieDetails = ({ movie, cast, onSelectActor, actorDetails, onBackToMovieList }) => {
  const [otherMovies, setOtherMovies] = useState([]);

  useEffect(() => {
    if (actorDetails) {
      fetchOtherMovies(actorDetails.id);
    }
  }, [actorDetails]);

  const fetchOtherMovies = async (actorId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ja`
      );
      const data = await response.json();

      const otherMoviesInJapanese = data.cast.map((otherMovie) => ({
        id: otherMovie.id,
        title: otherMovie.title,
        poster_path: otherMovie.poster_path,
      }));

      setOtherMovies(otherMoviesInJapanese);
    } catch (error) {
      console.error('Error fetching other movies:', error);
    }
  };

  return (
    <div>
      <h2>{movie.title}</h2>
      <button className={styles.botan} onClick={onBackToMovieList}>
        映画一覧に戻る
      </button>
      <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={`${movie.title}のポスター`} />

      <h2>{movie.title}の出演者</h2>
      <select onChange={onSelectActor}>
        <option value="">出演者を選択してください</option>
        {cast.map((actor) => (
          <option key={actor.id} value={actor.id}>
            {actor.name}
          </option>
        ))}
      </select>

      {actorDetails && (
        <div>
          <h3>{actorDetails.name}</h3>
          <p>性別: {actorDetails.gender === 1 ? '女性' : '男性'}</p>
          <p>誕生日: {actorDetails.birthday}</p>
          <p>出身地: {actorDetails.place_of_birth}</p>
          {actorDetails.profile_path && (
            <img
              src={`https://image.tmdb.org/t/p/w200${actorDetails.profile_path}`}
              alt={`${actorDetails.name}の写真`}
            />
          )}

          <div>
            <h3>他の出演作品</h3>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
              {otherMovies.map((otherMovie) => (
                <div key={otherMovie.id} style={{ marginRight: '10px' }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${otherMovie.poster_path}`}
                    alt={`${otherMovie.title}のポスター`}
                    style={{ width: '150px' }}
                  />
                  <p>{otherMovie.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;

