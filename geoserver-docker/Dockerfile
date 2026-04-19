
FROM tomcat:9-jdk17
FROM docker.osgeo.org/geoserver:2.28.1

# Set environment
ENV GEOSERVER_VERSION=2.28.1

# Download GeoServer
RUN apt-get update && apt-get install -y unzip wget && \
    wget https://sourceforge.net/projects/geoserver/files/GeoServer/${GEOSERVER_VERSION}/geoserver-${2.28.1}-war.zip && \
    unzip geoserver-${2.28.1}-war.zip && \
    cp geoserver.war /usr/local/tomcat/webapps/geoserver.war && \
    rm -rf geoserver-${2.28.1}-war.zip

# Expose port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]