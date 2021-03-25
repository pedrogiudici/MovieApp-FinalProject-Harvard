const url = new URL(window.location.href);
const input = url.searchParams.get("search")


document.addEventListener('DOMContentLoaded', function() {
    load()
})


window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
}


let counter = 1
function load(){
    document.querySelector('body').style.cursor = 'progress'
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=31f722e19304027de1a193514ee663c2&language=en-US&query=${input}&page=${counter}&include_adult=false`)
    .then(response => response.json())
    .then(movies => {
        movies.results.forEach(function(movie){
            if (movie.poster_path !== null) {
                const a = document.createElement('a')
                a.href = `/movie/${movie.id}`
                a.className = 'movielink'
                const div = document.createElement('div')
                div.className = 'movie-card'
                const img = document.createElement('img')
                img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                div.appendChild(img)
                if (movie.vote_average !== 0){
                    const rate = document.createElement('div')
                    rate.className = 'text'
                    rate.innerHTML = `<i class="material-icons">star</i> ${movie.vote_average}/10`
                    div.appendChild(rate)
                }
                a.appendChild(div)
                document.querySelector('#movies').appendChild(a)
            }
        })
        document.querySelector('body').style.cursor = 'default' 
    })
    .catch(error => {
        console.log('Error:', error);
        document.querySelector('body').style.cursor = 'default'
    })
    counter++
}