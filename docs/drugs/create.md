# Create Drug

This is used by a Store Owner to create a new Drug entry.

**URL** : `/api/v1/drug/create`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
  "name": "[drug name between 1-20 characters]",
  "chemical_name": "[array of string values with each value between 1-20 characters]",
  "price": "[number value for price of drug with value between 1-1000000]"
}
```

**Data example**

```json
{
  "name": "panadol",
  "chemical_name": ["chemical A", "chemical B", "chemical C"],
  "price": 2000
}
```

## Success Response

**Code** : `201 OK`

**Content example**

```json
{
  "status": "success",
  "message": "Drug entry was successful.",
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

**Condition** : If "name", "chemical name" and "price" are excluded or do not meet the conditions specified or drug name already exists.

**Code** : `500 Internal Server Error`

**Content** :

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Error</title>
  </head>
  <body>
    <pre>ValidationError: Drug validation failed: price: Path `price` is required., name: Path `name` is required.<br> &nbsp; &nbsp;at model.Document.invalidate </pre>
  </body>
</html>
```
