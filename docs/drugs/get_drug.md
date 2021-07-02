# Create Drug

This is used by Everyone to get the one existing Drug.

**URL** : `/api/v1/drug/:drug_name`

**Method** : `GET`

**Auth required** : NO

**Data constraints**

```
/api/v1/drug/:drug_name
```

**Data example**

```
/api/v1/drug/panadol
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "status": "success",
  "code": 200,
  "message": "The drug panadol has been sucessfully found and returned.",
  "body": {
    "drug": {
      "chemical_name": ["chemical A", "chemical B", "chemical C"],
      "_id": "60dd21e2cb4f7f34984d4dfb",
      "name": "panadol",
      "price": 2000,
      "available": true,
      "store": "60dd2185fbbc922c9c8db805"
    }
  }
}
```

## Error Response

**Condition** : If "drug_name" does not exist.

**Code** : `500 Internal Server Error`

**Content** :

```
Error
```