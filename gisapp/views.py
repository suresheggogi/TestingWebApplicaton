from pathlib import Path
from django.shortcuts import render
from django.http import HttpResponse
import sys
from subprocess import PIPE, run
import subprocess
from django.db import connection

def login_page(request):
    return render(request, 'LoginPage.html')

def home_page(request):
    return render(request, 'FirstPage.html')

def table_list(request):
    with connection.cursor() as cur:
            cur.execute("""
                        SELECT schemaname, tablename
                        FROM pg_catalog.pg_tables
                        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
                        ORDER BY schemaname, tablename;
                        """)
            tables = [f"{row[0]}.{row[1]}" for row in cur.fetchall()]
            return render(request, 'tables.html', {'tables': tables})
    
def FirstPage(request):
     return render(request, 'FirstPage.html')

def Mapview(request):
     return render(request, 'Mapview.html')