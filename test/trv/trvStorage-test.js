
const fs = require('fs')
const jsonFile = require('jsonfile')

describe('trvStorage.js', () => {
  let TrvStorage
  let fsExistsSyncSpy

  beforeAll(() => {
    TrvStorage = require('../../lib/trv/trvStorage.js')
  })

  afterAll(() => {
    fsExistsSyncSpy.mockRestore()
    delete require.cache[require.resolve('../../lib/trv/trvStorage.js')]
  })

  beforeEach(() => {
    fsExistsSyncSpy = jest.spyOn(fs, 'existsSync')
  })

  afterEach(() => {
    fsExistsSyncSpy.mockReset()
  })

  describe('trvStorage constructor', () => {
    let fsMkdirSpy

    beforeEach(() => {
      fsMkdirSpy = jest.spyOn(fs, 'mkdir')
    })

    afterEach(() => {
      fsMkdirSpy.mockReset()
    })

    afterAll(() => {
      fsMkdirSpy.mockRestore()
    })

    describe('when the folder does not exist', () => {
      beforeEach(() => {
        fsExistsSyncSpy.mockReturnValue(false)
        fsMkdirSpy.mockImplementation((path, cb) => {
          cb()
        })
      })

      it('calls the mkdir function', () => {
        TrvStorage()
        expect(fsMkdirSpy).toHaveBeenCalledTimes(1)
      })

      describe('when the mkdir function succeeds', () => {
        beforeEach(() => {
          fsMkdirSpy.mockImplementation((path, cb) => {
            cb()
          })
        })

        it('does not throw an error', () => {
          expect(() => {
            TrvStorage()
          }).not.toThrow()
        })
      })

      describe('when the mkdir function fails', () => {
        beforeEach(() => {
          fsMkdirSpy.mockImplementation((path, cb) => {
            cb(new Error('Bang!'))
          })
        })

        it('throws an error', () => {
          expect(() => {
            TrvStorage()
          }).toThrow()
        })
      })
    })

    describe('when the folder already exists', () => {
      beforeEach(() => {
        fsExistsSyncSpy.mockReturnValue(true)
      })

      it('does not call the mkdir function', () => {
        TrvStorage()
        expect(fsMkdirSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('trvStorage createTrv method', () => {
    let writeFileSpy
    let readFileSpy
    let trvStorage
    const trv = {
      'id': '3e105d3c-8671-4040-b4ed-0e8a40da0b02',
      'currentTemperature': 11.8,
      'ambientTemperature': 18,
      'name': 'Device 5',
      'serialId': 'OTRV-NG5504ORUR',
      'active': false,
      'activeSchedules': [],
      'metadata': {}
    }

    beforeEach(() => {
      writeFileSpy = jest.spyOn(jsonFile, 'writeFile')
      readFileSpy = jest.spyOn(jsonFile, 'readFile')
      fsExistsSyncSpy.mockReturnValue(true)
      trvStorage = new TrvStorage()
    })

    afterEach(() => {
      writeFileSpy.mockReset()
      readFileSpy.mockReset()
    })

    afterAll(() => {
      writeFileSpy.mockRestore()
      readFileSpy.mockRestore()
    })

    it('calls the jsonfile writeFile function', () => {
      writeFileSpy.mockImplementation((path, object, options, cb) => {
        cb()
      })
      readFileSpy.mockImplementation((path, cb) => {
        cb(null, {content: 'some data'})
      })

      return trvStorage.createTrv(trv)
        .then(() => {
          expect(writeFileSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('when the jsonfile writeFile function succeeds', () => {
      it('calls the jsonfile readFile function', () => {
        writeFileSpy.mockImplementation((path, object, options, cb) => {
          cb()
        })
        readFileSpy.mockImplementation((path, cb) => {
          cb(null, {content: 'some data'})
        })

        return trvStorage.createTrv(trv)
          .then(() => {
            expect(readFileSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the jsonfile readFile function succeeds', () => {
        it('returns a resolved promise with the trv the user wrote', () => {
          writeFileSpy.mockImplementation((path, object, options, cb) => {
            cb()
          })
          readFileSpy.mockImplementation((path, cb) => {
            cb(null, trv)
          })

          return trvStorage.createTrv(trv)
            .then(result => {
              expect(result).toEqual(trv)
            })
        })
      })

      describe('when the jsonfile readFile function fails', () => {
        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          writeFileSpy.mockImplementation((path, object, options, cb) => {
            cb()
          })
          readFileSpy.mockImplementation((path, cb) => {
            cb(new Error('Bang!'), null)
          })

          return trvStorage.createTrv(trv)
            .catch(error => {
              expect(error.message).toEqual('Bang!')
            })
        })
      })
    })

    describe('when the jsonfile writeFile function fails', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        writeFileSpy.mockImplementation((path, object, options, cb) => {
          cb(new Error('Bang!'))
        })

        return trvStorage.createTrv(trv)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })
  })

  describe('trvStorage getTrvById method', () => {
    let readFileSpy
    let trvStorage
    const trv = {
      'id': '3e105d3c-8671-4040-b4ed-0e8a40da0b02',
      'currentTemperature': 11.8,
      'ambientTemperature': 18,
      'name': 'Device 5',
      'serialId': 'OTRV-NG5504ORUR',
      'active': false,
      'activeSchedules': [],
      'metadata': {}
    }

    beforeEach(() => {
      readFileSpy = jest.spyOn(jsonFile, 'readFile')
      fsExistsSyncSpy.mockReturnValue(true)
      trvStorage = new TrvStorage()
    })

    afterEach(() => {
      readFileSpy.mockReset()
    })

    afterAll(() => {
      readFileSpy.mockRestore()
    })

    it('calls the jsonfile readFile function', () => {
      readFileSpy.mockImplementation((path, cb) => {
        cb(null, {content: 'some data'})
      })

      return trvStorage.getTrvById('3e105d3c-8671-4040-b4ed-0e8a40da0b02')
        .then(() => {
          expect(readFileSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('when the jsonfile readFile function succeeds', () => {
      it('returns a resolved promise with the json in the body', () => {
        readFileSpy.mockImplementation((path, cb) => {
          cb(null, trv)
        })

        return trvStorage.getTrvById('3e105d3c-8671-4040-b4ed-0e8a40da0b02')
          .then(result => {
            expect(result).toEqual(trv)
          })
      })
    })

    describe('when the jsonfile readFile function fails', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        readFileSpy.mockImplementation((path, cb) => {
          cb(new Error('Bang!'), null)
        })

        return trvStorage.getTrvById('3e105d3c-8671-4040-b4ed-0e8a40da0b02')
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })
  })

  describe('trvStorage getAllTrvs method', () => {

  })

  describe('trvStorage updateTrv method', () => {
    let writeFileSpy
    let readFileSpy
    let trvStorage
    const trv = {
      'id': '3e105d3c-8671-4040-b4ed-0e8a40da0b02',
      'currentTemperature': 11.8,
      'ambientTemperature': 18,
      'name': 'Device 5',
      'serialId': 'OTRV-NG5504ORUR',
      'active': false,
      'activeSchedules': [],
      'metadata': {}
    }

    beforeEach(() => {
      writeFileSpy = jest.spyOn(jsonFile, 'writeFile')
      readFileSpy = jest.spyOn(jsonFile, 'readFile')
      fsExistsSyncSpy.mockReturnValue(true)
      trvStorage = new TrvStorage()
    })

    afterEach(() => {
      writeFileSpy.mockReset()
      readFileSpy.mockReset()
    })

    afterAll(() => {
      writeFileSpy.mockRestore()
      readFileSpy.mockRestore()
    })

    it('calls the jsonfile writeFile function', () => {
      writeFileSpy.mockImplementation((path, object, options, cb) => {
        cb()
      })
      readFileSpy.mockImplementation((path, cb) => {
        cb(null, {content: 'some data'})
      })

      return trvStorage.updateTrv(trv)
        .then(() => {
          expect(writeFileSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('when the jsonfile writeFile function succeeds', () => {
      it('calls the jsonfile readFile function', () => {
        writeFileSpy.mockImplementation((path, object, options, cb) => {
          cb()
        })
        readFileSpy.mockImplementation((path, cb) => {
          cb(null, {content: 'some data'})
        })

        return trvStorage.updateTrv(trv)
          .then(() => {
            expect(readFileSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the jsonfile readFile function succeeds', () => {
        it('returns a resolved promise with the trv the user wrote', () => {
          writeFileSpy.mockImplementation((path, object, options, cb) => {
            cb()
          })
          readFileSpy.mockImplementation((path, cb) => {
            cb(null, trv)
          })

          return trvStorage.updateTrv(trv)
            .then(result => {
              expect(result).toEqual(trv)
            })
        })
      })

      describe('when the jsonfile readFile function fails', () => {
        it('returns a rejected promise with the error in the body', () => {
          expect.assertions(1)
          writeFileSpy.mockImplementation((path, object, options, cb) => {
            cb()
          })
          readFileSpy.mockImplementation((path, cb) => {
            cb(new Error('Bang!'), null)
          })

          return trvStorage.updateTrv(trv)
            .catch(error => {
              expect(error.message).toEqual('Bang!')
            })
        })
      })
    })

    describe('when the jsonfile writeFile function fails', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        writeFileSpy.mockImplementation((path, object, options, cb) => {
          cb(new Error('Bang!'))
        })

        return trvStorage.updateTrv(trv)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })
  })

  describe('trvStorage deleteTrv method', () => {
    let fsUnlinkSpy
    let trvStorage

    beforeEach(() => {
      fsUnlinkSpy = jest.spyOn(fs, 'unlink')
      fsExistsSyncSpy.mockReturnValue(true)
      trvStorage = new TrvStorage()
    })

    afterEach(() => {
      fsUnlinkSpy.mockReset()
    })

    afterAll(() => {
      fsUnlinkSpy.mockRestore()
    })

    it('calls the fs unlink function', () => {
      fsUnlinkSpy.mockImplementation((path, cb) => {
        cb()
      })

      return trvStorage.deleteTrv('3e105d3c-8671-4040-b4ed-0e8a40da0b02')
        .then(() => {
          expect(fsUnlinkSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('when the fs unlink function succeeds', () => {
      it('returns a resolved promise', () => {
        fsUnlinkSpy.mockImplementation((path, cb) => {
          cb()
        })

        return trvStorage.deleteTrv('3e105d3c-8671-4040-b4ed-0e8a40da0b02')
      })
    })

    describe('when the fs unlink function fails', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        fsUnlinkSpy.mockImplementation((path, cb) => {
          cb(new Error('Bang!'))
        })

        return trvStorage.deleteTrv('3e105d3c-8671-4040-b4ed-0e8a40da0b02')
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })
  })
})
