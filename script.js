const apiKey = "25c56382";

const searchForm = document.getElementById("search-form");
const searchBtn = document.getElementById("search-btn");
const articlesEl = document.getElementById("articles");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const formData = new FormData(searchForm);
  renderMovieSearchData(formData.get("movieQuery"));
});

async function renderMovieSearchData(movieQuery) {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${apiKey}&s=${movieQuery}&type=movie&plot=full`,
  );
  const data = await response.json();
  console.log(data);
  if (data.Response === "True") {
    for (let movie of data.Search) {
      renderMovieData(movie.imdbID);
    }
  } else if (data.Response === "False") {
    console.log(data.Response);
  }
}

async function renderMovieData(id) {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}&type=movie&plot=full`,
  );
  const data = await response.json();
  renderMovie(data);
}

function renderMovie(movieData) {
  const { Title, imdbRating, Poster, Runtime, Genre, Plot } = movieData;
  let moviesHtml = `<article class="movie">
            <img src="${Poster}" alt="" class="poster-movie" />
            <div class="movie-content">
              <h2 class="title-movie">${Title}</h2>
              <div class="info-movie">
                <p class="runtime">${Runtime}</p>
                <p class="genre">${Genre}</p>
                <button id="add-watchlist-btn">Watchlist</button>
              </div>
              <p class="plot-movie">
                ${Plot}
              </p>
            </div>
          </article>
          <div class="line"></div>`;

  console.log(moviesHtml);
  articlesEl.innerHTML += moviesHtml;
  document.getElementById("decoration").style.display = "none";
}
