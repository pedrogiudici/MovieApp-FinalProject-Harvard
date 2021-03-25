document.addEventListener('DOMContentLoaded', function(){
    load()
})


window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
}


let counter = 1
function load() {
    document.querySelector('body').style.cursor = 'progress'
    fetch('/addwatchlist')
    .then(response => response.json())
    .then(data => {
        data.moviesid.forEach(function(movieid){
            fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=31f722e19304027de1a193514ee663c2&language=en-US`)
            .then(response => response.json())
            .then(movie => {
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
            })
            .catch(error => {
                console.log('Error:', error);
            })
        })
        document.querySelector('body').style.cursor = 'default'
    })
    counter++
}