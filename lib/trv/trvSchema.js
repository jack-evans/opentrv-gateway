module.exports = {
  "$id": "http://example.com/example.json",
  "type": "object",
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "id": {
      "$id": "/properties/id",
      "type": "string"
    },
    "currentTemperature": {
      "$id": "/properties/currentTemperature",
      "type": "number"
    },
    "targetTemperature": {
      "$id": "/properties/targetTemperature",
      "type": "integer"
    },
    "ambientTemperature": {
      "$id": "/properties/ambientTemperature",
      "type": "integer"
    },
    "name": {
      "$id": "/properties/name",
      "type": "string"
    },
    "serialId": {
      "$id": "/properties/serialId",
      "type": "string"
    },
    "active": {
      "$id": "/properties/active",
      "type": "boolean"
    },
    "activeSchedules": {
      "$id": "/properties/activeSchedules",
      "type": "array",
      "items": {
        "$id": "/properties/activeSchedules/items",
        "type": "string"
      }
    },
    "metadata": {
      "$id": "/properties/metadata",
      "type": "object"
    }
  },
  "required": [
    "id",
    "currentTemperature",
    "targetTemperature",
    "ambientTemperature",
    "name",
    "serialId",
    "active",
    "activeSchedules",
    "metadata"
  ]
}