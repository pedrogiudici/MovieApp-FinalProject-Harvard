# Generated by Django 3.1.5 on 2021-03-24 23:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movieapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='watchlist',
            field=models.TextField(blank=True),
        ),
    ]