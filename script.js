const API_KEY = "25c56382";
const BASE_URL = "https://www.omdbapi.com/";
const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const decorationEl = document.getElementById("decoration-el");
const moviesEl = document.getElementById("movies-el");
const errorEl = document.getElementById("error-el");

searchBtn.addEventListener("click", handleSearch);
document.addEventListener("click", handleBtnClick);

async function handleSearch(e) {
  e.preventDefault();
  if (searchInput.value) {
    const result = await getSearchResultData(searchInput.value);

    if (result.length > 0) {
      const moviesData = await getMoviesData(result);
      renderSearch(moviesData);
      errorEl.classList.add("hidden");
    } else {
      moviesEl.classList.add("hidden");
      errorEl.classList.remove("hidden");
    }
    decorationEl.classList.add("hidden");
    searchInput.value = "";
  }
}

function handleBtnClick(e) {
  if (e.target.dataset.movie) {
    const movie = JSON.parse(e.target.dataset.movie);
    const movieBtn = document.querySelector(
      `button[data-id="${e.target.dataset.id}"]`,
    );

    if (savedMovies.some((movie) => movie.id === e.target.dataset.id)) {
      savedMovies.splice(
        savedMovies.findIndex((fmovie) => fmovie.id === e.target.dataset.id),
        1,
      );
      movieBtn.innerHTML = `<img
      src="./assets/plus-icon.png"
      alt=""
      class="movie__save-icon"
      data-movie='${JSON.stringify(movie).replace(/'/g, "&apos;")}'
      data-id='${e.target.dataset.id}'
      />
      Watchlist`;
    } else {
      savedMovies.push(movie);
      movieBtn.innerHTML = `<img
      src="./assets/minus-icon.png"
      alt=""
      class="movie__save-icon"
      data-movie='${JSON.stringify(movie).replace(/'/g, "&apos;")}'
      data-id='${e.target.dataset.id}'
      />
      Remove`;
    }
    localStorage.removeItem("movies");
    localStorage.setItem("movies", JSON.stringify(savedMovies));
  }
}

async function getSearchResultData(movieTitle) {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${movieTitle}&type=movie`,
  );
  const json = await response.json();
  if (json.Response === "True") {
    const movieIds = [];
    for (let movie of json.Search) {
      movieIds.push(movie.imdbID);
    }
    return movieIds;
  } else {
    return [];
  }
}

async function getMoviesData(moviesId) {
  let moviesData = [];
  for (let id of moviesId) {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
    const movie = await response.json();
    moviesData.push({
      title: movie.Title,
      runtime: movie.Runtime,
      genre: movie.Genre,
      plot: movie.Plot,
      poster: movie.Poster,
      rating: movie.imdbRating,
      id: id,
    });
  }
  return moviesData;
}

function renderSearch(movies) {
  moviesEl.classList.remove("hidden");
  let moviesHtmlStr = ``;
  for (let data of movies) {
    let buttonContent;
    if (savedMovies.some((movie) => movie.id === data.id)) {
      buttonContent = `
        <img
          src="./assets/minus-icon.png"
          alt=""
          class="movie__save-icon"
          data-movie='${JSON.stringify(data).replace(/'/g, "&apos;")}'
          data-id='${data.id}'
        />
        Remove
      `;
    } else {
      buttonContent = `
        <img
          src="./assets/plus-icon.png"
          alt=""
          class="movie__save-icon"
          data-movie='${JSON.stringify(data).replace(/'/g, "&apos;")}'
          data-id='${data.id}'
        />
        Watchlist
      `;
    }
    moviesHtmlStr += `
       <article class="movie">
          <div class="movie__container flex-align-center">
            <img src="${data.poster}" class="movie__poster" alt="Poster of ${data.title}" />
            <div class="movie__info">
              <div class="flex-align-center">
                <h2 class="movie__title">${data.title}</h2>
                <img
                  src="./assets/rating-icon.png"
                  class="movie__rating-icon"
                  alt=""
                />
                <p class="small-text">${data.rating}</p>
              </div>
              <div class="movie__meta-info flex-align-center">
                <p class="small-text">${data.runtime}</p>
                <p class="small-text">${data.genre}</p>
                <button class="movie__save-btn flex-align-center" data-movie='${JSON.stringify(data).replace(/'/g, "&apos;")}' data-id='${data.id}'>
                  ${buttonContent}
                </button>
              </div>
              <p class="movie__plot">
                ${data.plot}
              </p>
            </div>
          </div>
          <div class="line"></div>
        </article>
  `;
  }
  moviesEl.innerHTML = moviesHtmlStr;
}
