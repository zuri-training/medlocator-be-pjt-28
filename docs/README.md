# REST API docs for MedLocator API

**Base URL** : [Medlocator API](https://medlocator-pjt-28.herokuapp.com)

## Open Endpoints

Open endpoints require no Authentication.

* [Register](register.md) : `POST /api/v1/user/register`
* [Login](login.md) : `POST /api/v1/user/login`

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

### Current Store related

Each endpoint manipulates or displays information related to the User whose
Token is provided with the request:

* [Logout](logout.md) : `GET /api/v1/user/logout`
