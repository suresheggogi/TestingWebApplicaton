import os
import requests
from requests.auth import HTTPBasicAuth
from django.conf import settings

GEOSERVER_URL = os.getenv('GEOSERVER_URL', 'http://localhost:8080/geoserver/rest')
USERNAME = os.getenv('GEOSERVER_USERNAME', 'admin')
PASSWORD = os.getenv('GEOSERVER_PASSWORD', '')


def create_workspace(workspace_name):
    """
    Create a workspace in GeoServer.
    
    Args:
        workspace_name (str): Name of the workspace to create
        
    Returns:
        int: HTTP response status code
    """
    url = f"{GEOSERVER_URL}/workspaces"

    # Fixed: Replace undefined variable 'webapplictiondata' with workspace_name parameter
    data = {
        "workspace": {"name": workspace_name}
    }

    try:
        response = requests.post(
            url,
            json=data,
            auth=HTTPBasicAuth(USERNAME, PASSWORD),
            headers={"Content-Type": "application/json"}
        )
        return response.status_code
    except requests.exceptions.RequestException as e:
        print(f"Error creating workspace: {e}")
        return None
