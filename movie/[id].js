// pages/movie/[id].js

import React from 'react';
import { useRouter } from 'next/router';

const MovieDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const movieData = JSON.parse(router.query.movieData || '{}');

  // もしmovieDataが空でない場合、詳細情報を表示するなどの処理を追加

  return (
    <div>
      <h1>Movie Detail Page</h1>
      <p>Movie ID: {id}</p>
      {/* 他の詳細情報の表示処理を追加 */}
    </div>
  );
};

export default MovieDetailPage;

