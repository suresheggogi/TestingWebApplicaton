# Use a smaller, official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Create a non-root user
RUN addgroup --system app && adduser --system --group app

# Install dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project code
COPY . /app/

# Run database migrations (ignore if database doesn't exist or table exists)
RUN python manage.py migrate || true


# Collect static files
RUN python manage.py collectstatic --noinput || true

# Change ownership of the files
RUN chown -R app:app /app

# Switch to the non-root user
USER app

# Make port 8000 available to the world outside this container
EXPOSE 8000



# Set the Django settings module
ENV DJANGO_SETTINGS_MODULE=giswebApplciation.settings

# Default command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]




FROM docker.osgeo.org/geoserver:2.28.1

# Set data directory inside container
ENV GEOSERVER_DATA_DIR=/opt/geoserver_data

# Copy your local GeoServer data (VERY IMPORTANT)
COPY geoserver_data/ /opt/geoserver_data/

# Fix permissions (important for Railway/Linux)
USER root
RUN chmod -R 777 /opt/geoserver_data

# Expose port
EXPOSE 8080

# Railway uses dynamic port → map it
ENV JAVA_OPTS="-Djetty.port=8080"

# Start GeoServer
CMD ["startup.sh"]



