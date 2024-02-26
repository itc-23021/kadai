// MovieList.js
import React from 'react';

const MovieList = ({ movies, onSelectMovie }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
    {movies.map((movie) => (
      <div key={movie.id} style={{ cursor: 'pointer' }} onClick={() => onSelectMovie(movie)}>
        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={`${movie.title}のポスター`} />
        <p>{movie.title}</p>
      </div>
    ))}
  </div>
);

export default MovieList;

