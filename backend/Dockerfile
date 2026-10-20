# Estágio 1: Compilação do projeto com Maven e Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .

# Entra na pasta backend onde se encontra o pom.xml
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Estágio 2: Execução da aplicação com Java 21
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]