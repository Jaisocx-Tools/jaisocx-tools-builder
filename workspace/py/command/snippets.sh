#!/bin/bash 

# virtual environment folder setup, only once required, in this project in lo longer needed. juts commands history
python -m venv django-env

# virtual environment activation, each project start required
source django-env/bin/activate

# once, already done. installed here
pip install --upgrade django

# once, already done. in the project root folder, createe django project
django-admin startproject django

# once, already done. To create your app, make sure you’re in the same directory as manage.py and type this command:
cd django
python3 manage.py startapp JsonBackendEndpointsApplication

# once, already done. apply migrations
python3 manage.py migrate

# each time you start app, built-in server
python3 manage.py runserver

# path to edit views:
django/JsonBackendEndpointsApplication/views.py

# path to map a view to an url
django/JsonBackendEndpointsApplication/urls.py

# path tto create the global urls mapper for the project
django/django/urls.py

# path for Your classes
django/JsonBackendEndpointsApplication/lib

