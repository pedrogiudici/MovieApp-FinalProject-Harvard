import json

from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpRequest, JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from .models import User, Comment, Movie

# Create your views here.

def index(request):
    return render(request, 'movieapp/index.html')


def comments(request):
    if request.method == 'POST':
        rate = int(request.POST['rate'])
        comment = request.POST['comment']
        movieid = request.POST['id']
        commentm = Comment.objects.create(rate=rate, comment=comment)
        movie, created = Movie.objects.get_or_create(movieid=movieid)
        movie.comments.add(commentm)
    return HttpResponseRedirect(reverse('movie', args=(movieid, )))



def search(request):
    if request.method == 'GET':
        q = request.GET.get('search')
        return render(request, 'movieapp/search.html', {
            'search': q
        })

@login_required
def listwatchlist(request):
    return render(request, 'movieapp/watchlist.html')


def movie(request, movieid):
    addto = True
    if request.user.is_authenticated:
        user = User.objects.get(username=request.user)
        if user.watchlist != '':
            data = json.loads(user.watchlist)
            if movieid in data['moviesid']:   
                addto = False
    try:
        moviecomments = Movie.objects.get(movieid=movieid)
        moviecomments = moviecomments.comments.order_by('-timestamp')
    except:
        moviecomments = ''
    return render(request, 'movieapp/movie.html', {
        'movieid': movieid,
        'addto': addto,
        'moviecomments': moviecomments
    })


@csrf_exempt
@login_required
def addwatchlist(request):
    user = User.objects.get(username=request.user)
    if request.method == 'POST':
        movieid = int(json.loads(request.body)['id'])
        if user.watchlist == '':
            data = {'moviesid': [movieid]}
            addto = False
        else:
            data = json.loads(user.watchlist)
            if movieid in data['moviesid']:
                data['moviesid'].remove(movieid)
                addto = True
            else:
                data['moviesid'].append(movieid)
                addto = False
        user.watchlist = json.dumps(data)
        user.save()
        return JsonResponse({'status': 200, 'addto': addto})
    else:
        data = json.loads(user.watchlist)
        return JsonResponse(data)


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "movieapp/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "movieapp/login.html")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "movieapp/register.html", {
                "message": "Passwords must match."
            })
        try:
            user = User.objects.create_user(username, password=password)
            user.save()
        except IntegrityError:
            return render(request, "movieapp/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "movieapp/register.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))