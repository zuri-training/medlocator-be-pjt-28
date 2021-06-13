# MedLocator Backend API
This API handles all the backend details for the MedLocator Zuri Team 28 project.

## About MedLocator
Some of the technologies we use to build our software:

- Node.js
- React
- MongoDB

---

## Description

**MedLocator Backend API** is the foundation for our other MedLocator applications. The application is a REST API written in Javascript and based on an Express.js server.

Some of the features included in this app:

- REST API
- MongoDB ODM
- Authentication via JWT or basic-auth

## Prerequisites

- Node.js
- MongoDB database

## Dev Contribution Guide

1. Fork the repo.

2. Clone the repo into your local machine.

3. Create an upstream on your local machine to pull the latest code from the `develop` branch of this repository

3. Create a new branch on your local machine.

4. Switch to the branch and make all changes on that branch.

5. Commit changes to the branch and push to your forked repo.

6. Come back to this repo and open a pull request on the `develop` branch.

7. Link the pull request with your issue.

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

In progress.