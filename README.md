# This is the demo video streaming platform for practice project

## Project setup

```
git clone https://github.com/rifatsaown/yt-backend.git
```
```
yarn install
# you can also use npm but yarn is recommended
```
### Compiles and hot-reloads for development
```
yarn dev
```
### Typescript to Javascript transpile 
```
yarn build
```
### .env file setup
Create a .env file in the root directory and add the following variables
```
MONGO_URI=your_mongo_uri
DB_NAME = your_db_name
CLIENT_URL = your_client_url
ACCESS_TOKEN_SECRET= your_access_token_secret
ACCESS_TOKEN_EXPIRY= your_access_token_expiry
REFRESH_TOKEN_SECRET= your_refresh_token_secret
REFRESH_TOKEN_EXPIRY= your_refresh_token_expiry

CLOUDINARY_CLOUD_NAME= your_cloudinary_cloud_name
CLOUDINARY_API_KEY= your_cloudinary_api_key
CLOUDINARY_API_SECRET= your_cloudinary_api_secret
```