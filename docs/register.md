# Register a Store

Pharmacy store owners register their store on the app and receive a token.

**URL** : `/api/v1/user/register`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "name": "[store owner name]",
    "email": "[valid email address]",
    "password": "[password in plain text]",
    "passwordConfirm": "[repeat password in plain text]",
    "address": "[store address]",
    "contact": {
        "owner": "[contact name]",
        "email": "[contact email]",
        "phone": "[contact phone]"
    }
}
```

**Data example**

```json
{
    "name": "Team 28 Pharmacy",
    "email": "pjt28@zuri.team",
    "password": "password1",
    "passwordConfirm": "password1",
    "address": "8, Chevron Drive, Lekki Peninsula, Eti-Osa, Lagos",
    "contact": {
        "owner": "Stephen King",
        "email": "king.steph@gmeil.com",
        "phone": "08012345678"
    }
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDliY2U4MzdkYTNiY2M5MGU0M2UzZSIsImlhdCI6MTYyNDg4MjQwOCwiZXhwIjoxNjI0ODgyNDA4fQ.h4pEwyypPh3ZaPu37kQnBrhrxPEmENDxWSBppKNAX24",
    "store": {
        "_id": "60d9bce837da3bcc90e43e3e",
        "name": "Team 28 Pharmacy",
        "email": "pjt28@zuri.team",
        "address": "8, Chevron Drive, Lekki Peninsula, Eti-Osa, Lagos",
        "contact": {
            "owner": "Stephen King",
            "email": "king.steph@gmeil.com",
            "phone": "08012345678"
        },
        "__v": 0
    }
}
```

## Error Response

**Condition** : If 'email' is wrong.

**Code** : `500 Internal Server error`

**Content** :

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>ValidationError: Store validation failed: email: Enter a valid email<br> &nbsp; &nbsp;at model.Document.invalidate (path)</pre>
</body>
</html>
```
