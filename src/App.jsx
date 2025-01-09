import { useEffect, useState } from "react";
import StarComponent from "./components/StarComponent";
import Test from "./components/Test";

function App() {
  const key = "479f6f3f";

  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("inception");
  const [error, setError] = useState("");
  const [seletedId, setSelectedId] = useState("tt1375666");
  const results = movies.length;

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );
        if (!data.ok) throw new Error("Data Not Found Connection lost");
        const result = await data.json();
        if (result.Response == "False") throw new Error("Movie Not Found");
        // console.log(result)
        setMovies(result.Search);
        setError("");
      } catch (err) {
        if (err.name !== "Abort") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    // console.log(movies);
    handelCloseSMovie();
    fetchMovies();
    return function () {
      controller.abort();
    };
  }, [query]);

  function handelSelectedId(id) {
    setSelectedId((prevId) => (prevId == id ? null : id));
  }
  function handelCloseSMovie() {
    setSelectedId(null);
  }
  function handelAddMovie(movie) {
    setWatchedMovies((watchedMovies) => [...watchedMovies, movie]);
  }
  function handelRemove(id) {
    setWatchedMovies(watchedMovies.filter((movie) => movie.imdbID != id));
  }

  return (
    <>
      <div className="bg-slate-900 min-h-screen w-full">
        <Navbar results={results} setQuery={setQuery} />
        <div className="flex justify-center gap-5">
          <Box>
            {isLoading && <Loader />}
            {!isLoading && !error && (
              <MovieList movieList={movies} onSelectId={handelSelectedId} />
            )}
            {error && <ErrorEle message={error} />}
          </Box>
          <Box>
            {seletedId ? (
              <MovieDetails
                watchedMovies={watchedMovies}
                seletedId={seletedId}
                onCloseSMovie={handelCloseSMovie}
                onAddMovie={handelAddMovie}
              />
            ) : (
              <>
                <WatchedSummary watchedMovies={watchedMovies} />
                <WatchedMovieList
                  watchedMovies={watchedMovies}
                  onRemoveWatched={handelRemove}
                />
              </>
            )}
          </Box>
        </div>
      </div>
    </>
  );
}
function ErrorEle({ message }) {
  return (
    <div>
      <p className="text-white font-bold flex justify-center">{message}</p>
    </div>
  );
}

function Loader() {
  return (
    <div>
      <p className="text-white font-bold flex justify-center">
        Loading wait......
      </p>
    </div>
  );
}

function Navbar({ setQuery, results }) {
  return (
    <div className="p-6">
      <div className="bg-blue-700 flex justify-between p-3 rounded-xl">
        <h2 className="text-white text-2xl font-bold pl-4">🍿 usePopcorn</h2>
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          className="text-cyan-100 bg-blue-800 w-96 px-4 py-2 rounded-xl shadow-md shadow-blue-500"
          placeholder="search"
        />
        <h4 className="text-xl text-white font-semibold pr-6">
          Found {results} top results
        </h4>
      </div>
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  function handelOpen() {
    setIsOpen((open) => !open);
  }
  return (
    <div className="w-1/4 min-h-screen bg-slate-800  rounded-lg">
      <div className="flex justify-end pt-2 pr-2">
        <button className="text-lg" onClick={handelOpen}>
          ⛔
        </button>
      </div>
      {isOpen ? children : " "}
    </div>
  );
}

function MovieList({ movieList, onSelectId }) {
  return (
    <div>
      <div className="p-4">
        {movieList.map((movie, index) => (
          <Movie movie={movie} key={movie.imdbID} onSelectId={onSelectId} />
        ))}
      </div>
    </div>
  );
}
function Movie({ movie, onSelectId }) {
  return (
    <div
      onClick={() => onSelectId(movie.imdbID)}
      className="flex gap-4 border-2 border-slate-700 px-4 py-2 rounded-lg mb-2 hover:bg-slate-900"
    >
      <img className="h-20" src={movie.Poster} alt={movie.Title} />
      <div className="flex flex-col justify-center gap-3 px-5">
        <p className="text-white font-semibold ">{movie.Title}</p>
        <p className="text-white font-semibold">🗓️ {movie.Year}</p>
      </div>
    </div>
  );
}

function MovieDetails({ seletedId, onCloseSMovie, onAddMovie, watchedMovies }) {
  const key = "479f6f3f";
  const [ourMovie, setOurMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watchedMovies
    .map((movie) => movie.imdbID)
    .includes(seletedId);
  const watchedUserRating = watchedMovies.find(
    (movie) => movie.imdbID == seletedId
  )?.userRating;

  // const {Title :title ,Year : year ,Poster:poster,Runtime :runtime,imdbRating,
  //   Plot:plot,Released : released,Actors:actors,Director:director,Genre:genre
  // } = ourMovie;

  useEffect(() => {
    function callback(event) {
      if (event.code == "Escape") {
        console.log("Closing");
        onCloseSMovie();
      }
    }
    document.addEventListener("keydown", callback);

    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseSMovie]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await fetch(
        `http://www.omdbapi.com/?i=${seletedId}&apikey=${key}`
      );
      const res = await data.json();
      console.log(res);
      setOurMovie(res);
      setIsLoading(false);
    }
    fetchData();
  }, [seletedId]);

  function handelAdd(ourMovie) {
    const newMovie = {
      imdbID: seletedId,
      Title: ourMovie.Title,
      userRating: userRating,
      Year: ourMovie.Year,
      Poster: ourMovie.Poster,
      imdbRating: ourMovie.imdbRating,
      Runtime: Number(ourMovie.Runtime.split(" ").at(0)),
    };
    onAddMovie(newMovie);
    console.log(newMovie);
    onCloseSMovie();
  }

  useEffect(() => {
    if (!ourMovie.Title) return;
    document.title = `Movie | ${ourMovie.Title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [ourMovie.Title]);

  return (
    <div>
      <button className="text-xl" onClick={onCloseSMovie}>
        ⬅️
      </button>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="pt-2 flex gap-4 bg-gray-700">
            <img className="h-56" src={ourMovie.Poster} alt={ourMovie.Title} />
            <div className="text-white flex flex-col gap-2 ml-2 pb-2 justify-center">
              <p className="text-2xl font-bold text-slate-300 mb-3">
                {ourMovie.Title}
              </p>
              <p className="text-slate-300 pb-2">
                {ourMovie.Released} • {ourMovie.Runtime}
              </p>
              <p className="text-slate-300 pb-2">{ourMovie.Genre}</p>
              <p className="text-slate-300 pb-2">
                ⭐ {ourMovie.imdbRating} IMDB Rating
              </p>
            </div>
          </div>
          <div className="mx-5 mt-4 bg-slate-700 p-4 rounded-xl">
            {!isWatched ? (
              <>
                <StarComponent
                  className="p-3"
                  maxlength={10}
                  onSetMainRating={setUserRating}
                />
                {userRating > 3 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => handelAdd(ourMovie)}
                      className="text-white py-2 bg-blue-700 w-56 rounded-2xl"
                    >
                      Add to list
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-300 pb-2">
                You already rated that movie {watchedUserRating} ⭐
              </p>
            )}
          </div>
          <div className="flex flex-col p-4 text-slate-300 ">
            <p className=" px-8 pt-4">
              <em>{ourMovie.Plot}</em>
            </p>
            <p className=" pt-2 px-8">Starring {ourMovie.Actors}</p>
            <p className="pt-2 px-8">Directed by {ourMovie.Director}</p>
          </div>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watchedMovies }) {
  const avgImdbRating = average(watchedMovies.map((movie) => movie.imdbRating));
  const avgUserRating = average(watchedMovies.map((movie) => movie.userRating));
  const avgRuntime = average(watchedMovies.map((movie) => movie.Runtime));

  function average(values) {
    return values.length === 0
      ? 0
      : values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  return (
    <>
      <div className="shadow-xl border-slate-600 w-full p-3 mb-3">
        <p className="text-white font-semibold text-lg">Movies You Watched</p>
        <div className="flex gap-4 py-3 text-white">
          <p>🎥 {watchedMovies.length}</p>
          <p>⭐ {avgImdbRating.toFixed(2)}</p>
          <p>🌟 {avgUserRating.toFixed(2)}</p>
          <p>⌛{avgRuntime.toFixed(2)} min</p>
        </div>
      </div>
    </>
  );
}

function WatchedMovieList({ watchedMovies, onRemoveWatched }) {
  return (
    <>
      {watchedMovies.map((movie, index) => {
        return (
          <div
            key={index}
            className="flex gap-4  items-center px-4 py-2 rounded-lg mb-2 hover:bg-slate-900"
          >
            <img className="h-16" src={movie.Poster} alt={movie.Title} />
            <div className="px-4">
              <p className="text-white pb-2 font-semibold">{movie.Title}</p>
              <div className="flex gap-3 items-center justify-center text-white">
                <p>⭐ {movie.imdbRating}</p>
                <p>🌟 {movie.userRating}</p>
                <p>⌛ {movie.Runtime} min</p>
              </div>
            </div>
            <button
              onClick={() => {
                onRemoveWatched(movie.imdbID);
              }}
              className="ml-6 bg-slate-950 px-2 py-2 rounded-full"
            >
              ❌
            </button>
          </div>
        );
      })}
    </>
  );
}

export default App;
