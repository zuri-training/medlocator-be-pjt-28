# MedLocator Backend API
This API handles all the backend details for the MedLocator Zuri Team 28 project.

## About MedLocator
MedLocator is a platform that seeks to assist users in finding particular drugs required in pharmacies around them. A user would not have to start asking around in case of an emergency, a quick search of the drug name and the current location of the user would produce a list of pharmacies that sell that drug currently and the stores will be arranged in order of stores closest to the user.  
This also helps users so that they go directly to the pharmacies that certainly have the drug in stock, and not simply nearest pharmacies.  
The platform collaborates with pharmacy store owners by enabling them register their store and update their drug inventories daily, in order to always be available for potential users.  

Some of the technologies we use to build our software:

- Node.js
- MongoDB
- Mapbox API
- Mapbox GL API
- Turf.js

---

## Description

**MedLocator Backend API** is the foundation for our other MedLocator applications. The application is a REST API written in Javascript and based on an Express.js server.

Some of the features included in this app:

- REST API
- MongoDB ODM
- Authentication via JWT

## Prerequisites

- Node.js
- MongoDB database

## Dev Contribution Guide

1. Fork the repo.

2. Clone the repo into your local machine.
```bash
git clone <url to repo> medlocator

cd medlocator
```

3. Create an upstream on your local machine to pull the latest code from the `develop` branch of this repository
```bash
git remote add upstream https://github.com/zuri-training/medlocator-be-pjt-28.git
```

3. Create a new branch on your local machine.
```bash
git branch dev
```

4. Switch to the branch and make all changes on that branch.
```bash
git checkout dev
```

5. Commit changes to the branch and push to your forked repo.
```bash
git add .

git commit -m "message"

git push origin dev
```

6. Come back to this repo and open a pull request on the `develop` branch.

7. Link the pull request with your issue.
```
Closes #<issue-number>
```

8. Do not merge your pull request yourself. Wait for review and merging.

## Installation

First of all, create your `.env` file  
Windows users
```cmd
copy .env.example .env
```
Bash/Shell users
```bash
cp .env.example .env
```
Make sure to change the environment variables to match your own development environment  

Afterwards, run the following commands to install the node modules and start the webserver:

```
npm install
npm run server
```

This should connect to your MongoDB, start the Express server and allow you to test the API with `Postman` or `Thunder Client` or any other.

## User Guide

Check the [API documentation](docs/README.md) for more info.  
Still being updated...