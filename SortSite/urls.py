from django.conf.urls import include, url
from django.contrib import admin
from algorithm import views as algorithm_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^algorithm/', include('algorithm.urls')),
    url(r'^$', algorithm_views.index)
]
