document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.btn-group button')){
        document.querySelectorAll('.btn-group button').forEach(button => button.onclick = button => category(button))
        if (!sessionStorage.getItem('button')){
            document.querySelectorAll('.btn.btn-outline-secondary')[0].click()
        } else {
            const id = sessionStorage.getItem("button")
            document.querySelector(`#${id}`).click()
        }
    }
})


window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        load();
    }
}


let counter = 1
let bcategory = ''
function category(button){
    sessionStorage.setItem('button', button.target.id)
    document.querySelector('#movies').innerHTML = ''
    document.querySelectorAll('.btn-group button').forEach(function(button){
        button.style.backgroundColor = 'white'
        button.style.color = '#0d253f'
    })
    button.target.style.backgroundColor = '#0d253f'
    button.target.style.color = 'white'
    counter = 1
    bcategory = button.target.dataset.category
    load()
}


function load() {
    document.querySelector('body').style.cursor = 'progress'
    fetch(`https://api.themoviedb.org/3/movie/${bcategory}?api_key=31f722e19304027de1a193514ee663c2&language=en-US&page=${counter}`)
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
