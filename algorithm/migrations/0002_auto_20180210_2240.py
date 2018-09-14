# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2018-02-10 22:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('algorithm', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='algorithm',
            name='alg_complexity_average',
            field=models.CharField(default='DEFAULT VALUE', max_length=20),
        ),
        migrations.AddField(
            model_name='algorithm',
            name='alg_complexity_best',
            field=models.CharField(default='DEFAULT VALUE', max_length=20),
        ),
        migrations.AddField(
            model_name='algorithm',
            name='alg_complexity_worst',
            field=models.CharField(default='DEFAULT VALUE', max_length=20),
        ),
    ]