document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('body').style.cursor = 'progress'
    const movieid = document.querySelector('#id').innerText
    document.querySelector('#id').remove()
    if (document.querySelector('#rateform')){
        document.querySelector('#rateform').onsubmit = function(){
            rate(movieid)
            return false
        }
    }
    if (!document.querySelector('#rateform') && !document.querySelector('.comments')){
        document.querySelector('#comments').style.display = 'none'
    }
    fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=31f722e19304027de1a193514ee663c2&language=en-US`)
    .then(response => response.json())
    .then(movie => {
        document.querySelector('#poster').src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        document.querySelector('#title').innerText = movie.title
        document.querySelector('#tagline').innerText = movie.tagline
        document.querySelector('#overview').innerText = movie.overview
        if (movie.genres[0]){
            movie.genres.forEach(function(genre) {
                const span = document.createElement('span')
                span.className = "badge badge-dark"
                span.innerText = genre.name
                document.querySelector('#genres').appendChild(span)
            })
        } else {
            document.querySelector('#genres').remove()
        }
        if (movie.vote_average !== 0){
            document.querySelector('.progress-bar').style.width = `${movie.vote_average*10}%`
            document.querySelector('.progress-bar').setAttribute('aria-valuenow', movie.vote_average * 10)
            document.querySelector('.progress-bar').innerText = movie.vote_average
        } else{
            document.querySelector('#rating').remove()
        }
        if (movie.release_date){
            document.querySelector('#releasedate').innerHTML += movie.release_date
        } else {
            document.querySelector('#releasedate').remove()
        }
        if (movie.runtime){
            document.querySelector('#duration').innerHTML += `${Math.trunc(movie.runtime/60)}h ${movie.runtime%60}m`
        } else {
            document.querySelector('#duration').remove()
        }
        if (movie.homepage) {
            document.querySelector('#homepage').href = movie.homepage
            document.querySelector('#homepage').innerText = movie.homepage
        } else {
            document.querySelector('#homepagetext').remove()
        }
    })
    .catch(error => {
        console.log('Error:', error);
    })
    if (document.querySelector('.comments')){
        showcomments()
    }
    fetch(`https://api.themoviedb.org/3/movie/${movieid}/recommendations?api_key=31f722e19304027de1a193514ee663c2&language=en-US&page=1`)
    .then(response => response.json())
    .then(movies => {
        if (movies.total_results !== 0) {
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
        } else{
            document.querySelector('#recommendations').remove()
        }
        document.querySelector('body').style.cursor = 'default' 
    })
    .catch(error => {
        console.log('Error:', error);
        document.querySelector('body').style.cursor = 'default'
    })
    if (document.querySelector('#watchlist')){
        document.querySelector('#watchlist').addEventListener('click', () => watchlist(movieid))
    }
})


function watchlist(movieid){
    document.querySelector('body').style.cursor = 'progress'
    fetch('/addwatchlist', {
        method: 'POST',
        body: JSON.stringify({
            id: movieid
        })
    })
    .then(response => response.json())
    .then(res => {
        if (res.status === 200){
            if (res.addto){
                document.querySelector('#watchlist').innerText = 'Add to Watchlist'
            } else {
                document.querySelector('#watchlist').innerText = 'Remove from Watchlist'
            }
        }
        document.querySelector('body').style.cursor = 'default'
    })
    .catch(error => {
        console.log('Error:', error);
        document.querySelector('body').style.cursor = 'default'
    })
}


function rate(movieid){
    document.querySelector('body').style.cursor = 'progress'
    fetch('https://api.themoviedb.org/3/authentication/guest_session/new?api_key=31f722e19304027de1a193514ee663c2')
    .then(response => response.json())
    .then(status =>{
        if (status.success === true){
            fetch(`https://api.themoviedb.org/3/movie/${movieid}/rating?api_key=31f722e19304027de1a193514ee663c2&guest_session_id=${status.guest_session_id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    "value": document.querySelector('#rate').value,
                })
            })
            .then(response => response.json())
            .then(status =>{
                console.log(status)
                document.querySelector('body').style.cursor = 'default'
                document.querySelector('#rateform').submit()
            })
            .catch(error => {
                console.log('Error:', error)
                document.querySelector('body').style.cursor = 'default'
                document.querySelector('#rateform').submit()
            })
        } else{
            console.log(status.success)
            document.querySelector('body').style.cursor = 'default'
            document.querySelector('#rateform').submit()
        }
    })
    .catch(error => {
        console.log('Error:', error)
        document.querySelector('body').style.cursor = 'default'
        document.querySelector('#rateform').submit()
    })
}


let c = 2
function showcomments(){
    let length = document.querySelectorAll('.comments').length
    if (c > length){
        c = length
    }
    for (let i = 0; i < c; i++){
        document.querySelectorAll('.comments')[i].style.display = 'block'
    }
    last =  document.querySelectorAll('.comments')[length-1]
    if (last.style.display === 'none' && !document.querySelector('#loadmore')){
        const loadmore = document.createElement('button')
        loadmore.innerText = 'Load More'
        loadmore.className = 'submit centralize'
        loadmore.id = 'loadmore'
        loadmore.onclick = function() {
            c = c + 3
            showcomments()
        }
        document.querySelector('#loadmorediv').appendChild(loadmore)
    } else if (last.style.display === 'block' && document.querySelector('#loadmore')) {
        document.querySelector('#loadmore').remove()
    }
}