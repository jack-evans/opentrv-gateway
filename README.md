# opentrv-gateway

## Getting Started

Node and Npm are required for this project.

First need to run `npm install` to install all of the required modules. Then run `npm start` to start the server.

## Background

## API

basePath: /api/v1

### trv

#### GET /trv

Return all of the trv's connected to the gateway


| Specifics       | required      | type   |
| --------------- |:-------------:| ------:|
| params          | no            | N/A    |
| body            | No            |   N/A  |
| returns         | N/A           |  Array |

#### GET /trv/{id}

Return the details of a particular trv that is connected to the gateway


| Specifics       | required      | type   |
| --------------- |:-------------:| ------:|
| params          | Yes, id       | String |
| body            | No            |   N/A  |
| returns         | N/A           | Object |

#### PUT /trv/{id}

Update the details of a trv that is connected to the gateway


| Specifics       | required      | type   |
| --------------- |:-------------:| ------:|
| params          | yes, id       | String |
| body            | yes, fields of trv that wished to be changed | Object |
| returns         | N/A           | Object |

#### DELETE /trv/{id}

Delete a trv that is connected to the gateway

| Specifics       | required      | type   |
| --------------- |:-------------:| ------:|
| params          | yes, id       | String |
| body            | No            |   N/A  |
| returns         | N/A           |  N/A   |

Returns nothing

#### GET /trv/{id}/isActive

Return whether a particular trv is active or not

| Specifics       | required      | type   |
| --------------- |:-------------:| ------:|
| params          | yes, id       | String |
| body            | No            |   N/A  |
| returns         | N/A           | Object |

#### GET /trv/{id}/temperature

Returns the current temperature for a particular trv

| Specifics       | required      | type   |
| --------------- |:-------------:| ------:|
| params          | yes, id       | String |
| body            | No            |   N/A  |
| returns         | N/A           | Object |

#### PUT /trv/{id}/temperature

Updates the target temperature for a particular trv

| Specifics       | required      | type   |
| --------------- |:-------------:| ------:|
| params          | yes, id       | String |
| body            | yes, with target temperature property | Object |
| returns         | N/A           | N/A    |

#### GET /trv/{id}/info

returns a JSON object of time, current temperature, target temperature and activity

### schedules

#### POST /schedule

#### GET /schedule

#### GET /schedule/{scheduleId}

#### PUT /schedule/{scheduleId}

#### DELETE /schedule/{scheduleId}
