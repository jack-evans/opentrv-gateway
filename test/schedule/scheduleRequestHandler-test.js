import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')
const Promise = require('bluebird')
expect.extend(toBeType)

describe('scheduleRequestHandler', () => {
  let scheduleRequestHandler

  beforeAll(() => {
    scheduleRequestHandler = require('../../lib/schedule/scheduleRequestHandler')
  })

  afterAll(() => {
    delete require.cache[require.resolve('../../lib/schedule/scheduleRequestHandler')]
  })

  describe('createScheduleRequestHandler', () => {
    let req
    let res
    let createScheduleSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'POST',
        path: '/schedule',
        body: {
          name: 'test schedule',
          targetTemperature: [28],
          startTime: ['16:00'],
          endTime: ['19:00'],
          devicesAppliedOn: ['1234578']
        },
        scheduleStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      createScheduleSpy = jest.spyOn(scheduleRequestHandler.internal, '_createSchedule')
    })

    afterEach(() => {
      createScheduleSpy.mockReset()
    })

    afterAll(() => {
      createScheduleSpy.mockRestore()
    })

    it('calls the _createSchedule internal function', (done) => {
      createScheduleSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(createScheduleSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      scheduleRequestHandler.createScheduleRequestHandler(req, res)
    })

    describe('when the _createSchedule internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          createScheduleSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 400', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.createScheduleRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.createScheduleRequestHandler(req, res)
        })
      })

      describe('with a 409', () => {
        let error = {
          statusCode: 409,
          message: 'conflict'
        }

        beforeEach(() => {
          createScheduleSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 409', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(409)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.createScheduleRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.createScheduleRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          createScheduleSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.createScheduleRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.createScheduleRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          createScheduleSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.createScheduleRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.createScheduleRequestHandler(req, res)
        })
      })
    })
  })

  describe('getAllSchedulesRequestHandler', () => {
    let req
    let res
    let getAllSchedulesSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        path: '/schedule',
        scheduleStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getAllSchedulesSpy = jest.spyOn(scheduleRequestHandler.internal, '_getAllSchedules')
    })

    afterEach(() => {
      getAllSchedulesSpy.mockReset()
    })

    afterAll(() => {
      getAllSchedulesSpy.mockRestore()
    })

    it('calls the _getAllSchedules internal function', (done) => {
      getAllSchedulesSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getAllSchedulesSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
    })

    it('calls the _getAllSchedules internal function with the scheduleStorage', (done) => {
      getAllSchedulesSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getAllSchedulesSpy).toHaveBeenCalledWith(req.scheduleStorage)
          done()
        } catch (e) {
          done(e)
        }
      })

      scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
    })

    describe('when the _getAllSchedules internal function succeeds', () => {
      const fakeScheduleDocs = [{
        'id': '2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
        'currentTemperature': 25,
        'targetTemperature': 18,
        'ambientTemperature': 18,
        'name': 'new test',
        'serialId': 'OTRV-D0L2OO49TZ',
        'active': false,
        'activeSchedules': [],
        'metadata': {}
      }, {
        'id': '2d37b4f6-70e2-4255-4cb4-fb1cb844a357',
        'currentTemperature': 25,
        'targetTemperature': 18,
        'ambientTemperature': 18,
        'name': 'new test',
        'serialId': 'OTRV-D0L2OO49TZ',
        'active': false,
        'activeSchedules': [],
        'metadata': {}
      }]

      beforeEach(() => {
        getAllSchedulesSpy.mockReturnValue(Promise.resolve(fakeScheduleDocs))
      })

      it('returns 200', (done) => {
        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
      })

      it('returns the array', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual(fakeScheduleDocs)
            done()
          } catch (e) {
            done(e)
          }
        })

        scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
      })
    })

    describe('when the _getAllSchedules internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getAllSchedulesSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 400', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getAllSchedulesSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 404', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getAllSchedulesSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getAllSchedulesSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getAllSchedulesRequestHandler(req, res)
        })
      })
    })
  })

  describe('getScheduleByIdRequestHandler', () => {
    let req
    let res
    let getScheduleById

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/schedule/2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        scheduleStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getScheduleById = jest.spyOn(scheduleRequestHandler.internal, '_getScheduleById')
    })

    afterEach(() => {
      getScheduleById.mockReset()
    })

    afterAll(() => {
      getScheduleById.mockRestore()
    })

    it('calls the _getScheduleById internal function', (done) => {
      getScheduleById.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getScheduleById).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
    })

    it('calls the _getScheduleById internal function with the scheduleStorage and the id of the schedule to retrieve', (done) => {
      getScheduleById.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getScheduleById).toHaveBeenCalledWith(req.scheduleStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
    })

    describe('when the _getScheduleById internal function succeeds', () => {
      const fakeScheduleDoc = {
        'id': '2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
        'currentTemperature': 25,
        'targetTemperature': 18,
        'ambientTemperature': 18,
        'name': 'new test',
        'serialId': 'OTRV-D0L2OO49TZ',
        'active': false,
        'activeSchedules': [],
        'metadata': {}
      }

      beforeEach(() => {
        getScheduleById.mockReturnValue(Promise.resolve(fakeScheduleDoc))
      })

      it('returns 200', (done) => {
        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(200)
            done()
          } catch (e) {
            done(e)
          }
        })

        scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
      })

      it('returns the array', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual(fakeScheduleDoc)
            done()
          } catch (e) {
            done(e)
          }
        })

        scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
      })
    })

    describe('when the _getScheduleById internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getScheduleById.mockReturnValue(Promise.reject(error))
        })

        it('returns a 400', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getScheduleById.mockReturnValue(Promise.reject(error))
        })

        it('returns a 404', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getScheduleById.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getScheduleById.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.getScheduleByIdRequestHandler(req, res)
        })
      })
    })
  })

  describe('updateScheduleRequestHandler', () => {
    it('todo', () => {
      expect(1).toEqual(2)
    })
  })

  describe('deleteScheduleRequestHandler', () => {
    let req
    let res
    let deleteScheduleSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/trv/2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        scheduleStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      deleteScheduleSpy = jest.spyOn(scheduleRequestHandler.internal, '_deleteSchedule')
    })

    afterEach(() => {
      deleteScheduleSpy.mockReset()
    })

    afterAll(() => {
      deleteScheduleSpy.mockRestore()
    })

    it('calls the _deleteSchedule internal function', (done) => {
      deleteScheduleSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(deleteScheduleSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
    })

    it('calls the _deleteSchedule internal function with the scheduleStorage and the id of the schedule to delete', (done) => {
      deleteScheduleSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(deleteScheduleSpy).toHaveBeenCalledWith(req.scheduleStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
    })

    describe('when the _deleteSchedule internal function succeeds', () => {
      beforeEach(() => {
        deleteScheduleSpy.mockReturnValue(Promise.resolve())
      })

      it('returns 204', (done) => {
        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(204)
            done()
          } catch (e) {
            done(e)
          }
        })

        scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
      })

      it('returns an empty object', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual({})
            done()
          } catch (e) {
            done(e)
          }
        })

        scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
      })
    })

    describe('when the _deleteSchedule internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          deleteScheduleSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 400', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(400)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          deleteScheduleSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 404', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(404)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          deleteScheduleSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          deleteScheduleSpy.mockReturnValue(Promise.reject(error))
        })

        it('returns a 500', (done) => {
          res.on('end', () => {
            try {
              expect(res._getStatusCode()).toEqual(500)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
        })

        it('returns the error', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(error)
              done()
            } catch (e) {
              done(e)
            }
          })

          scheduleRequestHandler.deleteScheduleRequestHandler(req, res)
        })
      })
    })
  })

  describe('internal functions', () => {
    describe('_createSchedule', () => {
      it('todo', () => {
        expect(1).toEqual(2)
      })
    })

    describe('_getAllSchedules', () => {
      let scheduleStorage
      let getAllSchedulesSpy

      beforeEach(() => {
        scheduleStorage = {
          getAllSchedules: () => {}
        }
        getAllSchedulesSpy = jest.spyOn(scheduleStorage, 'getAllSchedules')
      })

      afterEach(() => {
        getAllSchedulesSpy.mockReset()
      })

      afterAll(() => {
        getAllSchedulesSpy.mockRestore()
      })

      it('calls the getAllSchedules method', () => {
        getAllSchedulesSpy.mockReturnValue(Promise.resolve())

        return scheduleRequestHandler.internal._getAllSchedules(scheduleStorage)
          .then(() => {
            expect(getAllSchedulesSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the getAllSchedules method succeeds', () => {
        it('returns a resolved promise with an array of trvs', () => {
          getAllSchedulesSpy.mockReturnValue(Promise.resolve([{}, {}, {}]))

          return scheduleRequestHandler.internal._getAllSchedules(scheduleStorage)
            .then(trvs => {
              expect(trvs).toEqual([{}, {}, {}])
            })
        })
      })

      describe('when the getAllSchedules method fails', () => {
        it('returns a rejected promise with an error in the body', () => {
          expect.assertions(1)
          getAllSchedulesSpy.mockReturnValue(Promise.reject(new Error('Bang!')))

          return scheduleRequestHandler.internal._getAllSchedules(scheduleStorage)
            .catch(error => {
              expect(error.message).toEqual('Bang!')
            })
        })
      })
    })

    describe('_getScheduleById', () => {
      let scheduleStorage
      let getScheduleByIdSpy

      beforeEach(() => {
        scheduleStorage = {
          getScheduleById: () => {}
        }
        getScheduleByIdSpy = jest.spyOn(scheduleStorage, 'getScheduleById')
      })

      afterEach(() => {
        getScheduleByIdSpy.mockReset()
      })

      afterAll(() => {
        getScheduleByIdSpy.mockRestore()
      })

      describe('when the trvId is undefined', () => {
        it('does not call the getScheduleById database method', () => {
          expect.assertions(1)
          return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, undefined)
            .catch(() => {
              expect(getScheduleByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was undefined',
            name: 'bad request'
          }
          expect.assertions(1)
          return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the id is not a string', () => {
        it('does not call the getScheduleById database method', () => {
          expect.assertions(1)
          return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, 1234)
            .catch(() => {
              expect(getScheduleByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was not in string format',
            name: 'bad request'
          }
          expect.assertions(1)
          return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, 1234)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the id does not match the regex', () => {
        it('does not call the getScheduleById database method', () => {
          expect.assertions(1)
          return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, '1234')
            .catch(() => {
              expect(getScheduleByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'Id did not match the following regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/',
            name: 'bad request'
          }
          expect.assertions(1)
          return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, '1234')
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('the id is valid', () => {
        let regexSpy

        beforeEach(() => {
          regexSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true)
        })

        afterEach(() => {
          regexSpy.mockRestore()
        })

        it('calls the getScheduleById database method', () => {
          getScheduleByIdSpy.mockReturnValue(Promise.resolve())
          return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, '1234')
            .then(() => {
              expect(getScheduleByIdSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('when the getScheduleById database method succeeds', () => {
          const fakeTrvDoc = {
            'id': '1234',
            'currentTemperature': 25,
            'targetTemperature': 18,
            'ambientTemperature': 18,
            'name': 'new test',
            'serialId': 'OTRV-D0L2OO49TZ',
            'active': false,
            'activeSchedules': [],
            'metadata': {}
          }

          it('returns a resolved promise with the trv document', () => {
            getScheduleByIdSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
            return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, '1234')
              .then(trv => {
                expect(trv).toEqual(fakeTrvDoc)
              })
          })
        })

        describe('when the getScheduleById database method fails', () => {
          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)
            getScheduleByIdSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            return scheduleRequestHandler.internal._getScheduleById(scheduleStorage, '1234')
              .catch(error => {
                expect(error.message).toEqual('Bang!')
              })
          })
        })
      })
    })

    describe('_updateSchedule', () => {
      it('todo', () => {
        expect(1).toEqual(2)
      })
    })

    describe('_deleteSchedule', () => {
      let scheduleStorage
      let deleteScheduleSpy

      beforeEach(() => {
        scheduleStorage = {
          deleteSchedule: () => {}
        }
        deleteScheduleSpy = jest.spyOn(scheduleStorage, 'deleteSchedule')
      })

      afterEach(() => {
        deleteScheduleSpy.mockReset()
      })

      afterAll(() => {
        deleteScheduleSpy.mockRestore()
      })

      describe('when the trvId is undefined', () => {
        it('does not call the deleteSchedule database method', () => {
          expect.assertions(1)
          return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, undefined)
            .catch(() => {
              expect(deleteScheduleSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was undefined',
            name: 'bad request'
          }
          expect.assertions(1)
          return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the id is not a string', () => {
        it('does not call the deleteSchedule database method', () => {
          expect.assertions(1)
          return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, 1234)
            .catch(() => {
              expect(deleteScheduleSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was not in string format',
            name: 'bad request'
          }
          expect.assertions(1)
          return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, 1234)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the id does not match the regex', () => {
        it('does not call the deleteSchedule database method', () => {
          expect.assertions(1)
          return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, '1234')
            .catch(() => {
              expect(deleteScheduleSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'Id did not match the following regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/',
            name: 'bad request'
          }
          expect.assertions(1)
          return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, '1234')
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('the id is valid', () => {
        let regexSpy

        beforeEach(() => {
          regexSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true)
        })

        afterEach(() => {
          regexSpy.mockRestore()
        })

        it('calls the deleteSchedule database method', () => {
          deleteScheduleSpy.mockReturnValue(Promise.resolve())
          return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, '1234')
            .then(() => {
              expect(deleteScheduleSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('when the deleteSchedule database method succeeds', () => {
          it('returns a resolved promise', () => {
            deleteScheduleSpy.mockReturnValue(Promise.resolve())
            return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, '1234')
          })
        })

        describe('when the deleteSchedule database method fails', () => {
          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)
            deleteScheduleSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            return scheduleRequestHandler.internal._deleteSchedule(scheduleStorage, '1234')
              .catch(error => {
                expect(error.message).toEqual('Bang!')
              })
          })
        })
      })
    })
  })
})
