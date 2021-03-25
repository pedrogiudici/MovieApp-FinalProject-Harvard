from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    watchlist = models.TextField(blank=True)


class Comment(models.Model):
    rate = models.IntegerField()
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class Movie(models.Model):
    movieid = models.IntegerField()
    comments = models.ManyToManyField(Comment, related_name='moviecomments', blank=True)