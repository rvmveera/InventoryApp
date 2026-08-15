# =========================
# BUILD
# =========================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["InventoryAPI.csproj", "./"]

RUN dotnet restore "InventoryAPI.csproj"

COPY . .

RUN dotnet publish "InventoryAPI.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# =========================
# RUNTIME
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

# Native dependencies required by GDI+/Report rendering
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libgdiplus \
        libc6-dev \
        fontconfig \
        fonts-dejavu \
        fonts-liberation \
        fonts-freefont-ttf \
        libfreetype6 \
        libjpeg-turbo8 \
        libpng16-16 \
        libtiff6 \
        && \
    rm -rf /var/lib/apt/lists/*

# Some native libraries look for this name
RUN ln -sf /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll.so

# Copy published application
COPY --from=build /app/publish .

# Azure App Service container port
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "InventoryAPI.dll"]
