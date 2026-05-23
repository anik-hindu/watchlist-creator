const savedMovies = JSON.parse(localStorage.getItem("movies")) || [];

const savedMoviesEl = document.getElementById("saved-movies");
const emptyWatchlistEl = document.getElementById("empty-watchlist");

document.addEventListener("click", handleBtnClick);

function handleBtnClick(e) {
  if (e.target.dataset.movie) {
    const movie = JSON.parse(e.target.dataset.movie);
    savedMovies.splice(
      savedMovies.findIndex((fmovie) => fmovie.id === movie.id),
      1,
    );
    localStorage.removeItem("movies");
    localStorage.setItem("movies", JSON.stringify(savedMovies));
    renderWatchlist();
  }
}

function renderWatchlist() {
  console.log(savedMovies);
  if (savedMovies.length > 0) {
    savedMoviesEl.classList.remove("hidden");
    emptyWatchlistEl.classList.add("hidden");

    let moviesHtmlStr = ``;
    for (let data of savedMovies) {
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
                  <img
                    src="./assets/minus-icon.png"
                    alt=""
                    class="movie__save-icon"
                    data-movie='${JSON.stringify(data).replace(/'/g, "&apos;")}'
                    data-id='${data.id}'
                  />
                  Remove
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
    savedMoviesEl.innerHTML = moviesHtmlStr;
  } else {
    savedMoviesEl.innerHTML = "";
    savedMoviesEl.classList.add("hidden");
    emptyWatchlistEl.classList.remove("hidden");
  }
}

renderWatchlist();
