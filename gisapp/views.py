from django.shortcuts import render
from django.http import HttpResponse
import sys
from subprocess import PIPE, run
import subprocess
from django.shortcuts import render
from django.db import connection

def login_page(request):
    return render(request, 'LoginPage.html')
def home_page(request):
    with connection.cursor() as cur:
        cur.execute("""
                    SELECT schemaname, tablename
                    FROM pg_catalog.pg_tables
                    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
                    ORDER BY schemaname, tablename;
                    """)
        tables = [(row[0], row[1]) for row in cur.fetchall()]
    return render(request, 'Mapview.html', {'tables': tables})

def Myexternal(request):
    script_path = r"D:/WebAppli/giswebApplciation/giswebApplciation/gisapp/tests.py"
    output = subprocess.check_output([sys.executable, script_path], text=True)
    # currentime = output.strip()
    return render(request, 'Show.html', {'data1': output})


def table_list(request):
    with connection.cursor() as cur:
            cur.execute("""
                        SELECT schemaname, tablename
                        FROM pg_catalog.pg_tables
                        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
                        ORDER BY schemaname, tablename;
                        """)
            tables = [row[0] for row in cur.fetchall()]
            return render(request, 'tables.html', {'tables': tables})


