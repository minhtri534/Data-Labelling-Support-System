FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY ["DataLabellingSupportSystem.Api.csproj", "./"]
RUN dotnet restore

COPY . .
RUN dotnet publish DataLabellingSupportSystem.Api.csproj -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "DataLabellingSupportSystem.Api.dll"]