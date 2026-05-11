FROM eclipse-temurin:21-jre
WORKDIR /app
COPY yzb-hd/target/yzb.jar /app/app.jar
EXPOSE 8088
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS:--Xms512m -Xmx1024m} -jar /app/app.jar"]
