import requests
from requests.auth import HTTPBasicAuth

GEOSERVER_URL = "http://localhost:8080/geoserver/rest"
USERNAME = "admin"
PASSWORD = "suresh@1234"


def create_workspace(workspace_name):
    url = f"{GEOSERVER_URL}/workspaces"

    data = {
        "workspace": {"name": webapplictiondata }
    }

    response = requests.post(
        url,
        json=data,
        auth=HTTPBasicAuth(USERNAME, PASSWORD),
        headers={"Content-Type": "application/json"}
    )

    return response.status_code