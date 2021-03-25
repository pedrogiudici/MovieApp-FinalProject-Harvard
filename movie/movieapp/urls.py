from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('register', views.register, name='register'),
    path("logout", views.logout_view, name="logout"),
    path('movie/<int:movieid>', views.movie, name='movie'),
    path('addwatchlist', views.addwatchlist, name='addwatchlist'),
    path('watchlist', views.listwatchlist, name='listwatchlist'),
    path('search', views.search, name='search'),
    path('comments', views.comments, name='comments')
]