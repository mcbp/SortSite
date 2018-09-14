# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-13 18:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Algorithm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alg_name', models.CharField(max_length=50)),
                ('alg_description', models.CharField(max_length=1000)),
                ('alg_logo', models.CharField(max_length=1000)),
            ],
        ),
    ]