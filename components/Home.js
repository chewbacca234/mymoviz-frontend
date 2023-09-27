import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData] = useState([]);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  // Liked movies popover
  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className={styles.likedMovie}>{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Movies list from fetch TMDB
  useEffect(() => {
    const tempMoviesData = [];
    fetch('https://mymoviz-backend-ipjlvwf7y-chewbacca234.vercel.app/movies')
      .then(res => res.json())
      .then(res => {
        console.log('res', res)
        if (res.result) {
          res.movies.map(movie => tempMoviesData.push({
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
            overview: movie.overview
          }));
          setMoviesData(tempMoviesData)
        } else {
          console.log('ERROR', res.err);
        }
      });
  }, []);
  console.log('moviesData', moviesData)

  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;