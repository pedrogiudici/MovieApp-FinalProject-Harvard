# Movie-App

This is a website where you can find your next movie and create a watch list, it includes reviews, ratings and everything you need to know before choosing something to watch. In this project I use an API to provide me with data about the films. 

It has greater complexity and is sufficiently distinct from other projects in the course, with 3 Django models on the back-end, JavaScript on the front-end and responsive to mobile devices, this project meets all the requirements of distinction and complexity.

### Inside the static/movieapp: 
* An API logo
* Styles.css, for website design
* Js.js that will load as soon as the user enters the site (index.html). He is responsible for showing a catalog of films based on the category that the user chooses
* Movie.js that will load as soon as the user clicks on a movie (movie.html). He gives recommendations, information about the film and the possibility to put it on the watch list or make a review
* Search.js that loads as soon as the user does a search (search.html). It shows the films corresponding to the research done
* Watchlist.js loads as soon as the user tries to enter your watch list (watchlist.html). It shows the films that are on your watch list

### The templates/movieapp has all the templates, which includes the aforementioned ones and also templates for the login system

### In models.py are all the models, the first one for the user and his watchlist, the second one to store information about reviews and the last one to add the second one to the id of a movie

### In urls.py are all url paths

### In views.py are all the python logic that makes the site work correctly, three of which are for the user to login.
* index serves to load the home page
* comments is responsible for keeping the reviews of a movie in the database 
* search is responsible for the search system
* listwatchlist is responsible for showing all movies on the user's watch list
* movie is responsible for showing the movie page (works together with movie.js)
* addwatchlist takes the id of the movie in question and saves it in the database

Start the project by running ``` python manage.py runserver ```