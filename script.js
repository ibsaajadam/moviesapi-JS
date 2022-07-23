// TMDB

const API_KEY = 'api_key=641a115a20d8ade4c1e1a759beff7060';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Action",
      "pic": "assets/action.jpeg"
    },
    {
      "id": 12,
      "name": "Adventure",
      "pic": "assets/adventure.jpeg"
    },
    {
      "id": 16,
      "name": "Animation",
      "pic": "assets/animation.jpeg"
    },
    {
      "id": 35,
      "name": "Comedy",
      "pic": "assets/comedy.jpeg"
    },
    {
      "id": 80,
      "name": "Crime",
      "pic": "assets/crime.jpeg"
    },
    {
      "id": 99,
      "name": "Documentary",
      "pic": "assets/documentary.jpeg"
    },
    {
      "id": 18,
      "name": "Drama",
      "pic": "assets/drama.jpeg"
    },
    {
      "id": 10751,
      "name": "Family",
      "pic": "assets/family.jpeg"
    },
    {
      "id": 14,
      "name": "Fantasy",
      "pic": "assets/fantasy.jpeg"
    },
    {
      "id": 36,
      "name": "History",
      "pic": "assets/history.jpeg"
    },
    {
      "id": 27,
      "name": "Horror",
      "pic": "assets/horror.jpeg"
    },
    {
      "id": 10402,
      "name": "Music",
      "pic": "assets/musical.jpg"
    },
    {
      "id": 9648,
      "name": "Mystery",
      "pic": "assets/mystery.jpeg"
    },
    {
      "id": 10749,
      "name": "Romance",
      "pic": "assets/romance.jpeg"
    },
    {
      "id": 878,
      "name": "Science Fiction",
      "pic": "assets/sci-fi.jpeg"
    },
    {
      "id": 53,
      "name": "Thriller",
      "pic": "assets/thriller.jpeg"
    },
    {
      "id": 10752,
      "name": "War",
      "pic": "assets/war.jpeg"
    },
    {
      "id": 37,
      "name": "Western",
      "pic": "assets/western.jpeg"
    }
  ]

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

var selectedGenre = []
setGenre();
function setGenre(){
  tagsEl.innerHTML = '';
  genres.forEach(genre => {
    const t = document.createElement("div");
    t.classList.add('tag');
    t.classList.add('bg');
    t.id = genre.id;
    t.innerText = genre.name;
    t.style.backgroundImage = "url("+genre.pic+")";

    t.addEventListener('click', () => {
      if(selectedGenre.length == 0){
        selectedGenre.push(genre.id);
      } else {
        if(selectedGenre.includes(genre.id)){
            selectedGenre.forEach((id, index) => {
                if(id == genre.id){
                    selectedGenre.splice(index, 1);
                }
            })
        } else {
            selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre)
      getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
      highlightSelection()
    })
    tagsEl.append(t);
  })
}

function highlightSelection(){
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length != 0){
        selectedGenre.forEach(id => {
          const highlightedTag = document.getElementById(id);
          highlightedTag.classList.add('highlight');
        })
    }
}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
      clearBtn.classList.add('highlight')
    } else {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
            $(".tag").click(function() {
                $('html,body').animate({
                    scrollTop: $("#main").offset().top},
                    'slow');
            });
        })
        tagsEl.append(clear);
    }
}

getMovies(API_URL);

// Scroll to movies

$(".tag").click(function() {
    $('html,body').animate({
        scrollTop: $("#main").offset().top},
        'slow');
});


function getMovies(url){
    fetch(url).then(res => res.json()).then(data => {
        if(data.results.length !== 0){
          showMovies(data.results);
        } else {
          main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }
    })
}

function showMovies(data){
    main.innerHTML = '';
  
    data.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img src="${poster_path ? IMG_URL+poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">
    

        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>

        <div class="overview">
            <h3>Overview</h3>
            ${overview};
        </div>
        
        `

        main.appendChild(movieEl);
    })
}


function getColor(vote) {
    if(vote >= 8){
        return 'green'
    } else if (vote >= 5){
        return "orange"
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre = [];
    setGenre();
    if(searchTerm){
        getMovies(searchURL + '&query=' + searchTerm)
    } else {
        getMovies(API_URL);
    }
    $(this).submit(function() {
      $('html,body').animate({
          scrollTop: $("#main").offset().top},
          'slow');
    });
})