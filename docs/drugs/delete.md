# Create Drug

This is used by a Store Owner to delete an existing Drug.

**URL** : `/api/v1/drug/delete/:drug_name`

**Method** : `DELETE`

**Auth required** : YES

**Data constraints**

```
/api/v1/drug/delete/name_of_the_drug
```

**Data example**

```
/api/v1/drug/delete/panadol
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "status": "success",
  "code": 200,
  "message": "The drug panadol has been sucessfully deleted.",
  "body": {}
}
```

## Error Response

**Condition** : If "drug_name" does not exist.

**Code** : `500 Internal Server Error`

**Content** :

```
Error
```
