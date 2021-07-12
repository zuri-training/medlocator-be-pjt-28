# Create Drug

This is used by the Store Owner to get an array of existing Drugs.

**URL** : `/api/v1/drug/`

**Method** : `GET`

**Auth required** : YES

**Data constraints**

```
/api/v1/drug/?page=number&limit=number
```

**Data example**

```
/api/v1/drug/?page=1&limit=10
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "status": "success",
  "code": 200,
  "message": "The drugs have been sucessfully found and returned.",
  "body": [
    {
      "chemical_name": ["chemical A", "chemical B", "chemical C"],
      "_id": "60dd21e2cb4f7f34984d4dfb",
      "name": "panadol",
      "price": 2000,
      "available": true,
      "store": "60dd2185fbbc922c9c8db805"
    },
    {
      "chemical_name": ["chemical A", "chemical B", "chemical C"],
      "_id": "60dd21e2cb4f7f34984d4dfb",
      "name": "panadol",
      "price": 2000,
      "available": true,
      "store": "60dd2185fbbc922c9c8db805"
    },
    {
      "chemical_name": ["chemical A", "chemical B", "chemical C"],
      "_id": "60dd21e2cb4f7f34984d4dfb",
      "name": "panadol",
      "price": 2000,
      "available": true,
      "store": "60dd2185fbbc922c9c8db805"
    }
  ]
}
```

## Error Response

**Condition** : If "limit" and "page" are not set.

**Code** : `500 Internal Server Error`

**Content** :

```
Error
```
