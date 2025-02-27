# frances React frontend

## Overview

This is the React frontend for the frances project. It has been deployed on this site: http://www.frances-ai.com

### Main features:

1. Account Registration and Login:
![](screenshots/registration_login.gif)
2. Fulltext Search
![](screenshots/fulltext.gif)
3. Semantic Search
![](screenshots/semanticsearch.gif)
3. Term record page
![](screenshots/termrecord.gif)
4. Collection Page page
![](screenshots/page.gif)
5. Collection Details
![](screenshots/collectionDetails.gif)
6. Defoe Query
![](screenshots/defoequery.gif)


## Get Started

### Get source code repository

For the source code, run:

```bash
git clone https://github.com/frances-ai/frances-frontend
```

### Install npm

see the instructions to [install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Install dependencies

In the `frances-frontend` directory, run
`npm install`

### Run the frontend

Before running the frontend, make up the [backend](https://github.com/frances-ai/frances-api) is running.

In the `frances-frontend` directory, you can run:

`npm start`

Your local frances frontend can be accessed here: http://127.0.0.1:3000

## Cloud Deployment

Build the docker image: Run the following command in `frances-frontend` directory to build the image:
```bash
docker buildx build --platform <linux/arm/v7,linux/arm64/v8,>linux/amd64 --tag <docker username>/frances-front:latest --push .
```

For full cloud deployment see [frances-api](https://github.com/frances-ai/frances-api)
