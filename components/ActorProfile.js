// components/ActorProfile.js
import React from 'react';
import styles from '../styles/styles.module.css';

const ActorProfile = ({ actorDetails, onBackToMovieList }) => {
  const { name, profile_path, gender, birthday, place_of_birth, filmography } = actorDetails || {};

  return (
    <div>
      <button className={styles.botan} onClick={onBackToMovieList}>
        戻る
      </button>
      <h2>{name}</h2>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {profile_path && <img src={`https://image.tmdb.org/t/p/w200${profile_path}`} alt={name} />}
        <div>
          <p>性別: {gender}</p>
          <p>誕生日: {birthday}</p>
          <p>出生地: {place_of_birth}</p>
        </div>
      </div>

      <h3>他の出演作品</h3>
      <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
        {filmography &&
          filmography.map((movie) => (
            <div key={movie.id} style={{ marginRight: '10px' }}>
              <img src={`https://image.tmdb.org/t/p/w100${movie.poster_path}`} alt={`${movie.title}のポスター`} />
              <p>{movie.title}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ActorProfile;

