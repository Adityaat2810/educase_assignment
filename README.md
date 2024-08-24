# School Management API

This project is a Node.js-based API for managing school information, including creating new schools and retrieving sorted lists of schools based on user location.

## Features

- Create new schools with validation
- Retrieve schools sorted by distance from user's location
- Redis caching for improved performance
- Rate limiting to prevent abuse

## Technologies Used

- Node.js
- Express.js
- Prisma (ORM)
- Redis (for caching and rate limiting)
- Zod (for input validation)

## Setup

1. Clone the repository
2. Install dependencies:

3. Set up your environment variables:
- `PORT`: The port number for the server
- `REDIS_URL`: URL for your Redis instance
- `DATABASE_URL`: URL for mysql database


4. Set up the database:
   - Run the following commands to create and apply migrations:
     ```
     npx prisma migrate dev --name init
     ```
   - This command will create a new migration, apply it to the database, and generate the Prisma client.

4. Run the server:
  ```
   npm run dev
  ```


## API Endpoints

### Create a School

- **URL**: `/school`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 0,
    "longitude": 0
  }


### Get Schools

This endpoint allows you to get a list of schools sorted by their distance from a given location.

- **URL**: `/school`
- **Method**: GET
- **How to use it**: 
  Add your latitude and longitude to the URL like this:
  `/school?userLat=40.7128&userLon=-74.0060`