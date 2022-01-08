# Serverless Car collection based App
Github link: https://github.com/brian87/sls-cars
This project is a simple Car collection application using AWS Lambda combined with Serverless Framework. It used AWS DynamoDB for storing data and AWS S3 to store image. Also auth0 service is used for authentication of the user.
## Github link
https://github.com/brian87/sls-cars
# Functionality of the application

This application allows to perform CRUD operation on Car items. Each Car item can also optinally have an attachment image. Each authenticated user can access only his/her own created Car items.

# Car items

The application stores Car items, and each item contains the following fields:

* `userId` (string) - user id of authenticated user
* `carId` (string) - car id
* `model` (string) - model of a Car item (e.g. "Yaris")
* `maker` (string) - maker of a Car item (e.g. "Toyota")
* `year` (string) - year of a Car item (e.g. "2022")
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Car item

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Car tracker react app.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Import the collection: Final Project.postman_collection.json

# Application screenshot

![Alt text](images/CarsApp.png?raw=true "Image 1")


