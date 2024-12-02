# amd64 CPU Architecture, when not working, I have one more docker build, with arm64/v8
#FROM jaisocx/webserver:amd64.latest 

# arm64/v8 CPU Architecture
FROM jaisocx/webserver:mac.3.0.16

WORKDIR /usr/lib/jaisocx-http

CMD "java" "-Xms${JAVA_XMS}" "-Xmx${JAVA_XMX}" "-jar" "out/artifacts/jaisocx_http_jar/jaisocx-http.jar" "-nogui"

EXPOSE 443
EXPOSE 80

