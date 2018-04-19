import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')
const Promise = require('bluebird')
expect.extend(toBeType)

describe('trvRequestHandler', () => {
  let trvRequestHandler

  beforeAll(() => {
    trvRequestHandler = require('../../lib/trv/trvRequestHandler.js')
  })

  afterAll(() => {
    jest.restoreAllMocks()
    delete require.cache[require.resolve('../../lib/trv/trvRequestHandler.js')]
  })

  describe('createTrvRequestHandler', () => {
    let req
    let res
    let createTrvSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'POST',
        path: '/trv',
        body: {
          name: 'test trv',
          currentTemperature: 23,
          ambientTemperature: 15
        },
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      createTrvSpy = jest.spyOn(trvRequestHandler.internal, '_createTrv')
    })

    afterEach(() => {
      createTrvSpy.mockReset()
    })

    afterAll(() => {
      createTrvSpy.mockRestore()
    })

    it('calls the _createTrv internal function', (done) => {
      createTrvSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(createTrvSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.createTrvRequestHandler(req, res)
    })

    it('calls the _createTrv internal function with the trvStorage and body', (done) => {
      createTrvSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(createTrvSpy).toHaveBeenCalledWith(req.trvStorage, req.body)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.createTrvRequestHandler(req, res)
    })

    describe('when the _createTrv internal function succeeds', () => {
      const fakeTrvDoc = {
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
        createTrvSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
      })

      it('returns 201', (done) => {
        res.on('end', () => {
          try {
            expect(res._getStatusCode()).toEqual(201)
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.createTrvRequestHandler(req, res)
      })

      it('returns the object', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual(fakeTrvDoc)
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.createTrvRequestHandler(req, res)
      })
    })

    describe('when the _createTrv internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          createTrvSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.createTrvRequestHandler(req, res)
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

          trvRequestHandler.createTrvRequestHandler(req, res)
        })
      })

      describe('with a 409', () => {
        let error = {
          statusCode: 409,
          message: 'conflict'
        }

        beforeEach(() => {
          createTrvSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.createTrvRequestHandler(req, res)
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

          trvRequestHandler.createTrvRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          createTrvSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.createTrvRequestHandler(req, res)
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

          trvRequestHandler.createTrvRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          createTrvSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.createTrvRequestHandler(req, res)
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

          trvRequestHandler.createTrvRequestHandler(req, res)
        })
      })
    })
  })

  describe('getAllTrvsRequestHandler', () => {
    let req
    let res
    let getAllTrvsSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        path: '/trv',
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getAllTrvsSpy = jest.spyOn(trvRequestHandler.internal, '_getAllTrvs')
    })

    afterEach(() => {
      getAllTrvsSpy.mockReset()
    })

    afterAll(() => {
      getAllTrvsSpy.mockRestore()
    })

    it('calls the _getAllTrvs internal function', (done) => {
      getAllTrvsSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getAllTrvsSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getAllTrvsRequestHandler(req, res)
    })

    it('calls the _getAllTrvs internal function with the trvStorage', (done) => {
      getAllTrvsSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getAllTrvsSpy).toHaveBeenCalledWith(req.trvStorage)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getAllTrvsRequestHandler(req, res)
    })

    describe('when the _getAllTrvs internal function succeeds', () => {
      const fakeTrvDocs = [{
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
        getAllTrvsSpy.mockReturnValue(Promise.resolve(fakeTrvDocs))
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

        trvRequestHandler.getAllTrvsRequestHandler(req, res)
      })

      it('returns the array', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual(fakeTrvDocs)
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.getAllTrvsRequestHandler(req, res)
      })
    })

    describe('when the _getAllTrvs internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getAllTrvsSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getAllTrvsRequestHandler(req, res)
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

          trvRequestHandler.getAllTrvsRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getAllTrvsSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getAllTrvsRequestHandler(req, res)
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

          trvRequestHandler.getAllTrvsRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getAllTrvsSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getAllTrvsRequestHandler(req, res)
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

          trvRequestHandler.getAllTrvsRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getAllTrvsSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getAllTrvsRequestHandler(req, res)
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

          trvRequestHandler.getAllTrvsRequestHandler(req, res)
        })
      })
    })
  })

  describe('getTrvByIDRequestHandler', () => {
    let req
    let res
    let getTrvByIDSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/trv/2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getTrvByIDSpy = jest.spyOn(trvRequestHandler.internal, '_getTrvByID')
    })

    afterEach(() => {
      getTrvByIDSpy.mockReset()
    })

    afterAll(() => {
      getTrvByIDSpy.mockRestore()
    })

    it('calls the _getTrvByID internal function', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getTrvByIDRequestHandler(req, res)
    })

    it('calls the _getTrvByID internal function with the trvStorage and the id of the trv to retrieve', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledWith(req.trvStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getTrvByIDRequestHandler(req, res)
    })

    describe('when the _getTrvByID internal function succeeds', () => {
      const fakeTrvDoc = {
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
        getTrvByIDSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
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

        trvRequestHandler.getTrvByIDRequestHandler(req, res)
      })

      it('returns the array', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual(fakeTrvDoc)
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.getTrvByIDRequestHandler(req, res)
      })
    })

    describe('when the _getTrvByID internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvByIDRequestHandler(req, res)
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

          trvRequestHandler.getTrvByIDRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvByIDRequestHandler(req, res)
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

          trvRequestHandler.getTrvByIDRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvByIDRequestHandler(req, res)
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

          trvRequestHandler.getTrvByIDRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvByIDRequestHandler(req, res)
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

          trvRequestHandler.getTrvByIDRequestHandler(req, res)
        })
      })
    })
  })

  describe('updateTrvRequestHandler', () => {
    let req
    let res
    let getTrvByIDSpy
    let updateTrvSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'PUT',
        url: '/trv/2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        body: {
          'id': '2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
          'currentTemperature': 25,
          'targetTemperature': 18,
          'ambientTemperature': 18,
          'name': 'this is a new name',
          'serialId': 'OTRV-D0L2OO49TZ',
          'active': false,
          'activeSchedules': [],
          'metadata': {}
        },
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getTrvByIDSpy = jest.spyOn(trvRequestHandler.internal, '_getTrvByID')
      updateTrvSpy = jest.spyOn(trvRequestHandler.internal, '_updateTrv')
    })

    afterEach(() => {
      getTrvByIDSpy.mockReset()
      updateTrvSpy.mockReset()
    })

    afterAll(() => {
      getTrvByIDSpy.mockRestore()
      updateTrvSpy.mockRestore()
    })

    it('calls the _getTrvByID internal function', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())
      updateTrvSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.updateTrvRequestHandler(req, res)
    })

    it('calls the _getTrvByID internal function with the trvStorage and the id of the trv to retrieve', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())
      updateTrvSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledWith(req.trvStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.updateTrvRequestHandler(req, res)
    })

    describe('when the _getTrvByID internal function succeeds', () => {
      const fakeTrvDoc = {
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
        getTrvByIDSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
        updateTrvSpy.mockReturnValue(Promise.resolve())
      })

      it('calls the _updateTrv internal function', (done) => {
        res.on('end', () => {
          try {
            expect(updateTrvSpy).toHaveBeenCalledTimes(1)
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.updateTrvRequestHandler(req, res)
      })

      it('calls the _updateTrv internal function with the trvStorage, old trv and new trv', (done) => {
        res.on('end', () => {
          try {
            expect(updateTrvSpy).toHaveBeenCalledWith(req.trvStorage, fakeTrvDoc, req.body)
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.updateTrvRequestHandler(req, res)
      })

      describe('when the _updateTrv internal function succeeds', () => {
        let expected = {
          'id': '2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
          'currentTemperature': 25,
          'targetTemperature': 18,
          'ambientTemperature': 18,
          'name': 'this is a new name',
          'serialId': 'OTRV-D0L2OO49TZ',
          'active': false,
          'activeSchedules': [],
          'metadata': {}
        }

        beforeEach(() => {
          updateTrvSpy.mockReturnValue(Promise.resolve(expected))
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
        })

        it('returns the new trv', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(expected)
              done()
            } catch (e) {
              done(e)
            }
          })

          trvRequestHandler.updateTrvRequestHandler(req, res)
        })
      })

      describe('when the _updateTrv internal function fails', () => {
        describe('with a 400', () => {
          let error = {
            statusCode: 400,
            message: 'bad request'
          }

          beforeEach(() => {
            updateTrvSpy.mockReturnValue(Promise.reject(error))
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

            trvRequestHandler.updateTrvRequestHandler(req, res)
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

            trvRequestHandler.updateTrvRequestHandler(req, res)
          })
        })

        describe('with a 409', () => {
          let error = {
            statusCode: 409,
            message: 'conflict'
          }

          beforeEach(() => {
            updateTrvSpy.mockReturnValue(Promise.reject(error))
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

            trvRequestHandler.updateTrvRequestHandler(req, res)
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

            trvRequestHandler.updateTrvRequestHandler(req, res)
          })
        })

        describe('with a 500', () => {
          let error = {
            statusCode: 500,
            message: 'internal server error'
          }

          beforeEach(() => {
            updateTrvSpy.mockReturnValue(Promise.reject(error))
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

            trvRequestHandler.updateTrvRequestHandler(req, res)
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

            trvRequestHandler.updateTrvRequestHandler(req, res)
          })
        })

        describe('with a unexpected error', () => {
          let error = new Error('Bang!')

          beforeEach(() => {
            updateTrvSpy.mockReturnValue(Promise.reject(error))
          })

          it('returns a 400', (done) => {
            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(500)
                done()
              } catch (e) {
                done(e)
              }
            })

            trvRequestHandler.updateTrvRequestHandler(req, res)
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

            trvRequestHandler.updateTrvRequestHandler(req, res)
          })
        })
      })
    })

    describe('when the _getTrvByID internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
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

          trvRequestHandler.updateTrvRequestHandler(req, res)
        })
      })
    })
  })

  describe('deleteTrvRequestHandler', () => {
    let req
    let res
    let deleteTrvSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/trv/2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      deleteTrvSpy = jest.spyOn(trvRequestHandler.internal, '_deleteTrv')
    })

    afterEach(() => {
      deleteTrvSpy.mockReset()
    })

    afterAll(() => {
      deleteTrvSpy.mockRestore()
    })

    it('calls the _deleteTrv internal function', (done) => {
      deleteTrvSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(deleteTrvSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.deleteTrvRequestHandler(req, res)
    })

    it('calls the _deleteTrv internal function with the trvStorage and the id of the trv to delete', (done) => {
      deleteTrvSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(deleteTrvSpy).toHaveBeenCalledWith(req.trvStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.deleteTrvRequestHandler(req, res)
    })

    describe('when the _deleteTrv internal function succeeds', () => {
      beforeEach(() => {
        deleteTrvSpy.mockReturnValue(Promise.resolve())
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

        trvRequestHandler.deleteTrvRequestHandler(req, res)
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

        trvRequestHandler.deleteTrvRequestHandler(req, res)
      })
    })

    describe('when the _deleteTrv internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          deleteTrvSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.deleteTrvRequestHandler(req, res)
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

          trvRequestHandler.deleteTrvRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          deleteTrvSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.deleteTrvRequestHandler(req, res)
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

          trvRequestHandler.deleteTrvRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          deleteTrvSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.deleteTrvRequestHandler(req, res)
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

          trvRequestHandler.deleteTrvRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          deleteTrvSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.deleteTrvRequestHandler(req, res)
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

          trvRequestHandler.deleteTrvRequestHandler(req, res)
        })
      })
    })
  })

  describe('getTrvActivityRequestHandler', () => {
    let req
    let res
    let getTrvByIDSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/trv/2d47b4f6-70e2-4255-8cb4-fb1cb844a357/isActive',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getTrvByIDSpy = jest.spyOn(trvRequestHandler.internal, '_getTrvByID')
    })

    afterEach(() => {
      getTrvByIDSpy.mockReset()
    })

    afterAll(() => {
      getTrvByIDSpy.mockRestore()
    })

    it('calls the _getTrvByID internal function', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getTrvActivityRequestHandler(req, res)
    })

    it('calls the _getTrvByID internal function with the trvStorage and the id of the trv to retrieve', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledWith(req.trvStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getTrvActivityRequestHandler(req, res)
    })

    describe('when the _getTrvByID internal function succeeds', () => {
      const fakeTrvDoc = {
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
        getTrvByIDSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
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

        trvRequestHandler.getTrvActivityRequestHandler(req, res)
      })

      it('returns the activity', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual({active: fakeTrvDoc.active})
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.getTrvActivityRequestHandler(req, res)
      })
    })

    describe('when the _getTrvByID internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvActivityRequestHandler(req, res)
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

          trvRequestHandler.getTrvActivityRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvActivityRequestHandler(req, res)
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

          trvRequestHandler.getTrvActivityRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvActivityRequestHandler(req, res)
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

          trvRequestHandler.getTrvActivityRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvActivityRequestHandler(req, res)
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

          trvRequestHandler.getTrvActivityRequestHandler(req, res)
        })
      })
    })
  })

  describe('getTrvTemperatureRequestHandler', () => {
    let req
    let res
    let getTrvByIDSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/trv/2d47b4f6-70e2-4255-8cb4-fb1cb844a357/temperature',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getTrvByIDSpy = jest.spyOn(trvRequestHandler.internal, '_getTrvByID')
    })

    afterEach(() => {
      getTrvByIDSpy.mockReset()
    })

    afterAll(() => {
      getTrvByIDSpy.mockRestore()
    })

    it('calls the _getTrvByID internal function', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
    })

    it('calls the _getTrvByID internal function with the trvStorage and the id of the trv to retrieve', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledWith(req.trvStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
    })

    describe('when the _getTrvByID internal function succeeds', () => {
      const fakeTrvDoc = {
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
        getTrvByIDSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
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

        trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
      })

      it('returns the currentTemperature', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual({currentTemperature: fakeTrvDoc.currentTemperature})
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
      })
    })

    describe('when the _getTrvByID internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
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

          trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
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

          trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
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

          trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
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

          trvRequestHandler.getTrvTemperatureRequestHandler(req, res)
        })
      })
    })
  })

  describe('updateTrvTargetTemperatureRequestHandler', () => {
    let req
    let res
    let getTrvByIDSpy
    let updateTrvSpy

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'PUT',
        url: '/trv/2d47b4f6-70e2-4255-8cb4-fb1cb844a357/temperature',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        body: {
          'targetTemperature': 24
        },
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getTrvByIDSpy = jest.spyOn(trvRequestHandler.internal, '_getTrvByID')
      updateTrvSpy = jest.spyOn(trvRequestHandler.internal, '_updateTrv')
    })

    afterEach(() => {
      getTrvByIDSpy.mockReset()
      updateTrvSpy.mockReset()
    })

    afterAll(() => {
      getTrvByIDSpy.mockRestore()
      updateTrvSpy.mockRestore()
    })

    it('calls the _getTrvByID internal function', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())
      updateTrvSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
    })

    it('calls the _getTrvByID internal function with the trvStorage and the id of the trv to retrieve', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())
      updateTrvSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledWith(req.trvStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
    })

    describe('when the _getTrvByID internal function succeeds', () => {
      const fakeTrvDoc = {
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
        getTrvByIDSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
        updateTrvSpy.mockReturnValue(Promise.resolve())
      })

      it('calls the _updateTrv internal function', (done) => {
        res.on('end', () => {
          try {
            expect(updateTrvSpy).toHaveBeenCalledTimes(1)
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
      })

      it('calls the _updateTrv internal function with the trvStorage, old trv and new trv', (done) => {
        let newTrv = JSON.parse(JSON.stringify(fakeTrvDoc))
        newTrv.targetTemperature = req.body.targetTemperature
        res.on('end', () => {
          try {
            expect(updateTrvSpy).toHaveBeenCalledWith(req.trvStorage, fakeTrvDoc, newTrv)
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
      })

      describe('when the _updateTrv internal function succeeds', () => {
        let expected = {
          'id': '2d47b4f6-70e2-4255-8cb4-fb1cb844a357',
          'currentTemperature': 25,
          'targetTemperature': 24,
          'ambientTemperature': 18,
          'name': 'new test',
          'serialId': 'OTRV-D0L2OO49TZ',
          'active': false,
          'activeSchedules': [],
          'metadata': {}
        }

        beforeEach(() => {
          updateTrvSpy.mockReturnValue(Promise.resolve(expected))
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
        })

        it('returns the new trv', (done) => {
          res.on('end', () => {
            try {
              expect(res._getData()).toEqual(expected)
              done()
            } catch (e) {
              done(e)
            }
          })

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
        })
      })

      describe('when the _updateTrv internal function fails', () => {
        describe('with a 400', () => {
          let error = {
            statusCode: 400,
            message: 'bad request'
          }

          beforeEach(() => {
            updateTrvSpy.mockReturnValue(Promise.reject(error))
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

            trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
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

            trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
          })
        })

        describe('with a 409', () => {
          let error = {
            statusCode: 409,
            message: 'conflict'
          }

          beforeEach(() => {
            updateTrvSpy.mockReturnValue(Promise.reject(error))
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

            trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
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

            trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
          })
        })

        describe('with a 500', () => {
          let error = {
            statusCode: 500,
            message: 'internal server error'
          }

          beforeEach(() => {
            updateTrvSpy.mockReturnValue(Promise.reject(error))
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

            trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
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

            trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
          })
        })

        describe('with a unexpected error', () => {
          let error = new Error('Bang!')

          beforeEach(() => {
            updateTrvSpy.mockReturnValue(Promise.reject(error))
          })

          it('returns a 400', (done) => {
            res.on('end', () => {
              try {
                expect(res._getStatusCode()).toEqual(500)
                done()
              } catch (e) {
                done(e)
              }
            })

            trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
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

            trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
          })
        })
      })
    })

    describe('when the _getTrvByID internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
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

          trvRequestHandler.updateTrvTargetTemperatureRequestHandler(req, res)
        })
      })
    })
  })

  describe('getTrvInfoRequestHandler', () => {
    let req
    let res
    let getTrvByIDSpy
    const time = new Date()

    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/trv/2d47b4f6-70e2-4255-8cb4-fb1cb844a357/info',
        params: {
          id: '2d47b4f6-70e2-4255-8cb4-fb1cb844a357'
        },
        trvStorage: {}
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      getTrvByIDSpy = jest.spyOn(trvRequestHandler.internal, '_getTrvByID')
      global.Date = jest.fn(() => time)
    })

    afterEach(() => {
      jest.resetAllMocks()
      getTrvByIDSpy.mockReset()
    })

    afterAll(() => {
      jest.restoreAllMocks()
      getTrvByIDSpy.mockRestore()
    })

    it('calls the _getTrvByID internal function', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledTimes(1)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getTrvInfoRequestHandler(req, res)
    })

    it('calls the _getTrvByID internal function with the trvStorage and the id of the trv to retrieve', (done) => {
      getTrvByIDSpy.mockReturnValue(Promise.resolve())

      res.on('end', () => {
        try {
          expect(getTrvByIDSpy).toHaveBeenCalledWith(req.trvStorage, req.params.id)
          done()
        } catch (e) {
          done(e)
        }
      })

      trvRequestHandler.getTrvInfoRequestHandler(req, res)
    })

    describe('when the _getTrvByID internal function succeeds', () => {
      const fakeTrvDoc = {
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
        getTrvByIDSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
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

        trvRequestHandler.getTrvInfoRequestHandler(req, res)
      })

      it('returns the currentTemperature', (done) => {
        res.on('end', () => {
          try {
            expect(res._getData()).toEqual({
              id: fakeTrvDoc.id,
              currentTemperature: fakeTrvDoc.currentTemperature,
              targetTemperature: fakeTrvDoc.targetTemperature,
              active: fakeTrvDoc.active,
              timeStamp: time
            })
            done()
          } catch (e) {
            done(e)
          }
        })

        trvRequestHandler.getTrvInfoRequestHandler(req, res)
      })
    })

    describe('when the _getTrvByID internal function fails', () => {
      describe('with a 400', () => {
        let error = {
          statusCode: 400,
          message: 'bad request'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvInfoRequestHandler(req, res)
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

          trvRequestHandler.getTrvInfoRequestHandler(req, res)
        })
      })

      describe('with a 404', () => {
        let error = {
          statusCode: 404,
          message: 'not found'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvInfoRequestHandler(req, res)
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

          trvRequestHandler.getTrvInfoRequestHandler(req, res)
        })
      })

      describe('with a 500', () => {
        let error = {
          statusCode: 500,
          message: 'internal server error'
        }

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvInfoRequestHandler(req, res)
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

          trvRequestHandler.getTrvInfoRequestHandler(req, res)
        })
      })

      describe('with an unexpected error', () => {
        let error = new Error('Bang!')

        beforeEach(() => {
          getTrvByIDSpy.mockReturnValue(Promise.reject(error))
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

          trvRequestHandler.getTrvInfoRequestHandler(req, res)
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

          trvRequestHandler.getTrvInfoRequestHandler(req, res)
        })
      })
    })
  })

  describe('internal functions', () => {
    describe('_createTrv', () => {
      let trvStorage
      let createTrvSpy
      let trv = {
        name: 'test trv',
        currentTemperature: 23,
        ambientTemperature: 15
      }

      beforeEach(() => {
        trvStorage = {
          createTrv: () => {}
        }
        createTrvSpy = jest.spyOn(trvStorage, 'createTrv')
      })

      afterEach(() => {
        createTrvSpy.mockReset()
      })

      afterAll(() => {
        createTrvSpy.mockRestore()
      })

      describe('when the trv is not defined', () => {
        it('does not call the createTrv method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._createTrv(trvStorage, undefined)
            .catch(() => {
              expect(createTrvSpy).not.toHaveBeenCalled()
            })
        })

        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          let expectedError = {
            statusCode: 400,
            message: 'The body provided was undefined',
            name: 'bad request'
          }

          return trvRequestHandler.internal._createTrv(trvStorage, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the trv is not an object', () => {
        it('does not call the createTrv method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._createTrv(trvStorage, 'bad')
            .catch(() => {
              expect(createTrvSpy).not.toHaveBeenCalled()
            })
        })

        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          let expectedError = {
            statusCode: 400,
            message: 'The body provided was not an object. It was of the type string',
            name: 'bad request'
          }

          return trvRequestHandler.internal._createTrv(trvStorage, 'bad')
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the trv object is valid', () => {
        describe('when the json validator succeeds', () => {
          it('calls the createTrv method', () => {
            createTrvSpy.mockReturnValue(Promise.resolve())
            return trvRequestHandler.internal._createTrv(trvStorage, trv)
              .then(() => {
                expect(createTrvSpy).toHaveBeenCalledTimes(1)
              })
          })

          describe('when the createTrv method succeeds', () => {
            it('returns a resolved promise', () => {
              createTrvSpy.mockReturnValue(Promise.resolve())
              return trvRequestHandler.internal._createTrv(trvStorage, trv)
            })
          })

          describe('when the createTrv method fails', () => {
            it('returns a rejected promise', () => {
              expect.assertions(1)
              createTrvSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
              return trvRequestHandler.internal._createTrv(trvStorage, trv)
                .catch(error => {
                  expect(error.message).toEqual('Bang!')
                })
            })
          })
        })

        describe('when the json validator fails', () => {
          let badTrv = {
            someContent: 'bad trv'
          }

          it('does not call the createTrv method', () => {
            expect.assertions(1)
            return trvRequestHandler.internal._createTrv(trvStorage, badTrv)
              .catch(() => {
                expect(createTrvSpy).not.toHaveBeenCalled()
              })
          })

          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)

            return trvRequestHandler.internal._createTrv(trvStorage, badTrv)
              .catch(error => {
                expect(error.statusCode).toEqual(400)
              })
          })
        })
      })
    })

    describe('_getAllTrvs', () => {
      let trvStorage
      let getAllTrvsSpy

      beforeEach(() => {
        trvStorage = {
          getAllTrvs: () => {}
        }
        getAllTrvsSpy = jest.spyOn(trvStorage, 'getAllTrvs')
      })

      afterEach(() => {
        getAllTrvsSpy.mockReset()
      })

      afterAll(() => {
        getAllTrvsSpy.mockRestore()
      })

      it('calls the getAllTrvs method', () => {
        getAllTrvsSpy.mockReturnValue(Promise.resolve())

        return trvRequestHandler.internal._getAllTrvs(trvStorage)
          .then(() => {
            expect(getAllTrvsSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the getAllTrvs method succeeds', () => {
        it('returns a resolved promise with an array of trvs', () => {
          getAllTrvsSpy.mockReturnValue(Promise.resolve([{}, {}, {}]))

          return trvRequestHandler.internal._getAllTrvs(trvStorage)
            .then(trvs => {
              expect(trvs).toEqual([{}, {}, {}])
            })
        })
      })

      describe('when the getAllTrvs method fails', () => {
        it('returns a rejected promise with an error in the body', () => {
          expect.assertions(1)
          getAllTrvsSpy.mockReturnValue(Promise.reject(new Error('Bang!')))

          return trvRequestHandler.internal._getAllTrvs(trvStorage)
            .catch(error => {
              expect(error.message).toEqual('Bang!')
            })
        })
      })
    })

    describe('_getTrvByID', () => {
      let trvStorage
      let getTrvByIdSpy

      beforeEach(() => {
        trvStorage = {
          getTrvById: () => {}
        }
        getTrvByIdSpy = jest.spyOn(trvStorage, 'getTrvById')
      })

      afterEach(() => {
        getTrvByIdSpy.mockReset()
      })

      afterAll(() => {
        getTrvByIdSpy.mockRestore()
      })

      describe('when the trvId is undefined', () => {
        it('does not call the getTrvById database method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._getTrvByID(trvStorage, undefined)
            .catch(() => {
              expect(getTrvByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was undefined',
            name: 'bad request'
          }
          expect.assertions(1)
          return trvRequestHandler.internal._getTrvByID(trvStorage, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the id is not a string', () => {
        it('does not call the getTrvById database method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._getTrvByID(trvStorage, 1234)
            .catch(() => {
              expect(getTrvByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was not in string format',
            name: 'bad request'
          }
          expect.assertions(1)
          return trvRequestHandler.internal._getTrvByID(trvStorage, 1234)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the id does not match the regex', () => {
        it('does not call the getTrvById database method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._getTrvByID(trvStorage, '1234')
            .catch(() => {
              expect(getTrvByIdSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'Id did not match the following regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/',
            name: 'bad request'
          }
          expect.assertions(1)
          return trvRequestHandler.internal._getTrvByID(trvStorage, '1234')
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

        it('calls the getTrvById database method', () => {
          getTrvByIdSpy.mockReturnValue(Promise.resolve())
          return trvRequestHandler.internal._getTrvByID(trvStorage, '1234')
            .then(() => {
              expect(getTrvByIdSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('when the getTrvById database method succeeds', () => {
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
            getTrvByIdSpy.mockReturnValue(Promise.resolve(fakeTrvDoc))
            return trvRequestHandler.internal._getTrvByID(trvStorage, '1234')
              .then(trv => {
                expect(trv).toEqual(fakeTrvDoc)
              })
          })
        })

        describe('when the getTrvById database method fails', () => {
          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)
            getTrvByIdSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            return trvRequestHandler.internal._getTrvByID(trvStorage, '1234')
              .catch(error => {
                expect(error.message).toEqual('Bang!')
              })
          })
        })
      })
    })

    describe('_updateTrv', () => {
      let trvStorage
      let updateTrvSpy
      const oldTrv = {
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
      let trv = {
        name: 'trv living room',
        currentTemperature: 23,
        ambientTemperature: 15
      }

      beforeEach(() => {
        trvStorage = {
          updateTrv: () => {}
        }
        updateTrvSpy = jest.spyOn(trvStorage, 'updateTrv')
      })

      afterEach(() => {
        updateTrvSpy.mockReset()
      })

      afterAll(() => {
        updateTrvSpy.mockRestore()
      })

      describe('when the trv is not defined', () => {
        it('does not call the updateTrv method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, undefined)
            .catch(() => {
              expect(updateTrvSpy).not.toHaveBeenCalled()
            })
        })

        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          let expectedError = {
            statusCode: 400,
            message: 'The body provided was undefined',
            name: 'bad request'
          }

          return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the trv is not an object', () => {
        it('does not call the updateTrv method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, 'bad')
            .catch(() => {
              expect(updateTrvSpy).not.toHaveBeenCalled()
            })
        })

        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          let expectedError = {
            statusCode: 400,
            message: 'The body provided was not an object. It was of the type string',
            name: 'bad request'
          }

          return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, 'bad')
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the trv object is valid', () => {
        describe('when the json validator succeeds', () => {
          it('calls the updateTrv method', () => {
            updateTrvSpy.mockReturnValue(Promise.resolve())
            return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, trv)
              .then(() => {
                expect(updateTrvSpy).toHaveBeenCalledTimes(1)
              })
          })

          describe('when the updateTrv method succeeds', () => {
            it('returns a resolved promise', () => {
              updateTrvSpy.mockReturnValue(Promise.resolve())
              return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, trv)
            })
          })

          describe('when the updateTrv method fails', () => {
            it('returns a rejected promise', () => {
              expect.assertions(1)
              updateTrvSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
              return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, trv)
                .catch(error => {
                  expect(error.message).toEqual('Bang!')
                })
            })
          })
        })

        describe('when the json validator fails', () => {
          let badTrv = {
            someContent: 'bad trv'
          }

          it('does not call the updateTrv method', () => {
            expect.assertions(1)
            return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, badTrv)
              .catch(() => {
                expect(updateTrvSpy).not.toHaveBeenCalled()
              })
          })

          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)

            return trvRequestHandler.internal._updateTrv(trvStorage, oldTrv, badTrv)
              .catch(error => {
                expect(error.statusCode).toEqual(400)
              })
          })
        })
      })
    })

    describe('_deleteTrv', () => {
      let trvStorage
      let deleteTrvSpy

      beforeEach(() => {
        trvStorage = {
          deleteTrv: () => {}
        }
        deleteTrvSpy = jest.spyOn(trvStorage, 'deleteTrv')
      })

      afterEach(() => {
        deleteTrvSpy.mockReset()
      })

      afterAll(() => {
        deleteTrvSpy.mockRestore()
      })

      describe('when the trvId is undefined', () => {
        it('does not call the deleteTrv database method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._deleteTrv(trvStorage, undefined)
            .catch(() => {
              expect(deleteTrvSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was undefined',
            name: 'bad request'
          }
          expect.assertions(1)
          return trvRequestHandler.internal._deleteTrv(trvStorage, undefined)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the id is not a string', () => {
        it('does not call the deleteTrv database method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._deleteTrv(trvStorage, 1234)
            .catch(() => {
              expect(deleteTrvSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'The id provided was not in string format',
            name: 'bad request'
          }
          expect.assertions(1)
          return trvRequestHandler.internal._deleteTrv(trvStorage, 1234)
            .catch(error => {
              expect(error).toEqual(expectedError)
            })
        })
      })

      describe('when the id does not match the regex', () => {
        it('does not call the deleteTrv database method', () => {
          expect.assertions(1)
          return trvRequestHandler.internal._deleteTrv(trvStorage, '1234')
            .catch(() => {
              expect(deleteTrvSpy).toHaveBeenCalledTimes(0)
            })
        })

        it('returns a rejected promise with an error', () => {
          const expectedError = {
            statusCode: 400,
            message: 'Id did not match the following regex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/',
            name: 'bad request'
          }
          expect.assertions(1)
          return trvRequestHandler.internal._deleteTrv(trvStorage, '1234')
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

        it('calls the deleteTrv database method', () => {
          deleteTrvSpy.mockReturnValue(Promise.resolve())
          return trvRequestHandler.internal._deleteTrv(trvStorage, '1234')
            .then(() => {
              expect(deleteTrvSpy).toHaveBeenCalledTimes(1)
            })
        })

        describe('when the deleteTrv database method succeeds', () => {
          it('returns a resolved promise', () => {
            deleteTrvSpy.mockReturnValue(Promise.resolve())
            return trvRequestHandler.internal._deleteTrv(trvStorage, '1234')
          })
        })

        describe('when the deleteTrv database method fails', () => {
          it('returns a rejected promise with the error in the body', () => {
            expect.assertions(1)
            deleteTrvSpy.mockReturnValue(Promise.reject(new Error('Bang!')))
            return trvRequestHandler.internal._deleteTrv(trvStorage, '1234')
              .catch(error => {
                expect(error.message).toEqual('Bang!')
              })
          })
        })
      })
    })
  })
})
