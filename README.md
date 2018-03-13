# opentrv-gateway

## Background

## API

basePath: /api/v1

### trv

GET /trv

Return all of the trv's connected to the gateway

Returns an array

GET /trv/{id}

Return the details of a particular trv that is connected to the gateway

Returns a JSON object

PUT /trv/{id}

Update the details of a trv that is connected to the gateway

Returns a JSON object

DELETE /trv/{id}

Delete a trv that is connected to the gateway

Returns nothing

GET /trv/{id}/isActive

Return whether a particular trv is active or not

Returns a boolean value

GET /trv/{id}/temperature

Returns the current temperature for a particular trv

Returns a number

PUT /trv/{id}/temperature

Updates the target temperature for a particular trv

GET /trv/{id}/info

returns a JSON object of time, current temperature, target temperature and activity


### schedules

POST /trv/{id}/schedule

GET /trv/{id}/schedule

GET /trv/{id}/schedule/{scheduleId}

PUT /trv/{id}/schedule/{scheduleId}

DELETE /trv/{id}/schedule/{scheduleId}
