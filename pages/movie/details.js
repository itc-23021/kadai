import React from 'react';
import { useRouter } from 'next/router';

const MovieDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Movie Detail Page</h1>
      <p>Movie ID: {id}</p>
    </div>
  );
};

export default MovieDetailPage;
