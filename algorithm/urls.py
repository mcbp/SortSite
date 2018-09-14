from django.conf.urls import url
from . import views

app_name = 'algorithm'

urlpatterns = [
    # /algorithm/ (default)
    url(r'^$', views.index, name='index'),

    #/algorithm/bigo
    url(r'^bigo/$', views.bigo, name='bigo'),

    # /algorithm/<sort_id>/
    url(r'^(?P<algorithm_id>[0-9]+)/$', views.sort_detail, name='sort_detail'),

    url(r'^(?P<algorithm_id>[0-9]+)/start/$', views.bubble_sort, name='start_sort'),
]
