import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')
const Promise = require('bluebird')
expect.extend(toBeType)

describe('trvRequestHandler', () => {
  let trvRequestHandler

  beforeEach(() => {
    trvRequestHandler = require('../../lib/trv/trvRequestHandler.js')
  })

  afterEach(() => {
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

  })
})
