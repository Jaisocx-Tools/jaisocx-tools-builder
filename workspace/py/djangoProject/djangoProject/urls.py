from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    ### when You decomment the next line, the index page will be a json data example.
    # path('', include('djangoApplication.urls')),
    path('admin/', admin.site.urls),
]
