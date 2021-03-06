from django.urls import path

from .views import FeedbackView, ContactView


urlpatterns = [
    path('feedback/', FeedbackView.as_view(), name='feedback'),
    path('', ContactView.as_view(), name='contact'),
]
