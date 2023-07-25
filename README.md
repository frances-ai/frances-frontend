# frances React frontend

## Overview

This is the React frontend for the frances project. It has been deployed on this site: http://www.frances-ai.com

### Main features:

1. Account Registration and Login:
![](screenshots/registration_login.gif)
2. Term Search
![](screenshots/termSearch.gif)
3. Term Similarity
![](screenshots/termSimilarity.gif)
4. Topic Modelling
![](screenshots/topicModelling.gif)
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

## Cloud Deployment

Build the docker image: Run the following command in `frances-frontend` directory to build the image:
```bash
docker buildx build --platform <linux/arm/v7,linux/arm64/v8,>linux/amd64 --tag <docker username>/frances-front:latest --push .
```

For full cloud deployment see [frances-api](https://github.com/frances-ai/frances-api)
