module.exports = {
  '$id': 'http://example.com/example.json',
  'type': 'object',
  'definitions': {},
  '$schema': 'http://json-schema.org/draft-07/schema#',
  'additionalProperties': false,
  'properties': {
    'id': {
      '$id': '/properties/id',
      'type': 'string'
    },
    'name': {
      '$id': '/properties/name',
      'type': 'string'
    },
    'targetTemperature': {
      '$id': '/properties/targetTemperature',
      'type': 'array',
      'items': {
        '$id': '/properties/targetTemperature/items',
        'type': 'integer'
      }
    },
    'startTime': {
      '$id': '/properties/startTime',
      'type': 'array',
      'items': {
        '$id': '/properties/startTime/items',
        'type': 'string'
      }
    },
    'endTime': {
      '$id': '/properties/endTime',
      'type': 'array',
      'items': {
        '$id': '/properties/endTime/items',
        'type': 'string'
      }
    },
    'trvsAppliedOn': {
      '$id': '/properties/devicesAppliedOn',
      'type': 'array',
      'items': {
        '$id': '/properties/devicesAppliedOn/items',
        'type': 'string'
      }
    }
  },
  'required': [
    'id',
    'name',
    'targetTemperature',
    'startTime',
    'endTime',
    'trvsAppliedOn'
  ]
}
