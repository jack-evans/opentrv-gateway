
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
        new TrvStorage()
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
            new TrvStorage()
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
            new TrvStorage()
          }).toThrow()
        })
      })
    })

    describe('when the folder already exists', () => {
      beforeEach(() => {
        fsExistsSyncSpy.mockReturnValue(true)
      })

      it('does not call the mkdir function', () => {
        new TrvStorage()
        expect(fsMkdirSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('trvStorage createTrv method', () => {
    let writeFileSpy
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
      trvStorage = new TrvStorage()
    })

    afterEach(() => {
      writeFileSpy.mockReset()
    })

    afterAll(() => {
      writeFileSpy.mockRestore()
    })

    it('calls the jsonfile writeFile function', () => {
      
    })
  })

  describe('trvStorage getTrvById method', () => {

  })

  describe('trvStorage getAllTrvs method', () => {

  })

  describe('trvStorage updateTrv method', () => {

  })

  describe('trvStorage deleteTrv method', () => {

  })
})
