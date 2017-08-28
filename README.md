# URL Shortener Microservice

**User Story:** I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

**User Story:** If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

**User Story:** When I visit that shortened URL, it will redirect me to my original link.  

{
  "name": "mongodb-persistence-example",
  "version": "0.0.1",
  "description": "Demonstrate persistence using MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "*",
    "body-parser": "*",
    "nunjucks": "^1.3.4",
    "mongodb": "*",
    "synchronize": "^0.9.14"
  },
  "keywords": [
    "node",
    "express"
  ],
  "license": "MIT"
}