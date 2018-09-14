from django.db import models

class Algorithm(models.Model):
    alg_name = models.CharField(max_length=50)
    alg_description = models.CharField(max_length=1500)
    alg_logo = models.CharField(max_length=1000)
    alg_complexity_average = models.CharField(max_length=20, default='DEFAULT VALUE')
    alg_complexity_best = models.CharField(max_length=20, default='DEFAULT VALUE')
    alg_complexity_worst = models.CharField(max_length=20, default='DEFAULT VALUE')

    def __str__(self):
        return self.alg_name
