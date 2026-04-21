FROM docker.osgeo.org/geoserver:2.28.1

USER root

# Fix /tmp permissions FIRST (CRITICAL)
RUN chmod 1777 /tmp

# Install tools
RUN apt-get update && apt-get install -y unzip wget

# Set version
ENV GEOSERVER_VERSION=2.28.1

# Download GeoServer (OPTIONAL - usually not needed)
RUN wget https://sourceforge.net/projects/geoserver/files/GeoServer/${GEOSERVER_VERSION}/geoserver-${GEOSERVER_VERSION}-war.zip && \
    unzip geoserver-${GEOSERVER_VERSION}-war.zip && \
    cp geoserver.war /usr/local/tomcat/webapps/geoserver.war && \
    rm -rf geoserver-${GEOSERVER_VERSION}-war.zip

# Copy your data
COPY geoserver_data/ /opt/geoserver_data/

ENV GEOSERVER_DATA_DIR=/opt/geoserver_data