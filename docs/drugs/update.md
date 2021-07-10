# Create Drug

This is used by Store Owners to update existing Drugs.

**URL** : `/api/v1/drug/update/:drug_id`

**Method** : `PUT`

**Auth required** : YES

**Data constraints**

```json
{
  "name": "[drug name string]",
  "price": "[drug price number]"
}
```

**Data example**

```json
{
  "name": "paracetamol",
  "price": 5000
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "status": "success",
  "code": 200,
  "message": `The drug has been sucessfully updated.`,
  "body": {
    "drug": {
      "chemical_name": ["chemical A", "chemical B", "chemical C"],
      "_id": "60dd21e2cb4f7f34984d4dfb",
      "name": "paracetamol",
      "price": 5000,
      "available": true,
      "store": "60dd2185fbbc922c9c8db805"
    }
  }
}
```

## Error Response

**Condition** : If "drug_id" does not exist.

**Code** : `500 Internal Server Error`

**Content** :

```
Error
```
