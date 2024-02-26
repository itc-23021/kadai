// MovieDetails.js
import React from 'react';

const MovieDetails = ({ movie, cast, onSelectActor, actorDetails, onBackToMovieList }) => (
  <div>
    <h2>{movie.title}</h2>
    <button className="botan" onClick={onBackToMovieList}>映画一覧に戻る</button>
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
        <p>プロフィール: {actorDetails.biography}</p>
        {actorDetails.profile_path && (
          <img src={`https://image.tmdb.org/t/p/w200${actorDetails.profile_path}`} alt={`${actorDetails.name}の写真`} />
        )}
      </div>
    )}
  </div>
);

export default MovieDetails;

