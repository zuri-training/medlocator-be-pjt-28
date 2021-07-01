# Create Drug

This is used by a Store Owner to update the availability of an existing Drug.

**URL** : `/api/v1/drug/available`

**Method** : `PUT`

**Auth required** : YES

**Data constraints**

```json
{
  "available": "[boolean value]"
}
```

**Data example**

```json
{
  "available": true
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "status": "success",
  "code": 200,
  "message": "The drug's availability status has successfully been changed to false",
  "body": {}
}
```

## Error Response

**Condition** : If "available" is not set to a boolean value or is missing.

**Code** : `500 Internal Server Error`

**Content** :

```
Error
```
