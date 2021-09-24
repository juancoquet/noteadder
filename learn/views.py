from django.shortcuts import render

# Create your views here.

def learn_view(request):
    return render(request, 'learn.html')