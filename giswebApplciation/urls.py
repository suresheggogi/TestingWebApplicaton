from django.contrib import admin
from django.urls import path
from gisapp import views
from gisapp.views import table_list

urlpatterns = [
     path('admin/', admin.site.urls),
     path('', views.login_page),
     path('home/', views.home_page, name='home'),
     path('FirstPage/', views.FirstPage, name='FirstPage'),
     path('Mapview/', views.Mapview, name='Mapview'),
     # path('external/', views.Myexternal, name='Suresh'),
     # path('tables/', table_list, name='table_list'),
     
]
