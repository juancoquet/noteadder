from django.urls import path

import learn.views as views


urlpatterns = [
    path('', views.learn_view, name='learn'),
]