
const fs = require('fs')
const jsonFile = require('jsonfile')

describe('scheduleStorage.js', () => {
  let ScheduleStorage
  let fsExistsSyncSpy

  beforeAll(() => {
    ScheduleStorage = require('../../lib/schedule/scheduleStorage.js')
  })

  afterAll(() => {
    fsExistsSyncSpy.mockRestore()
    delete require.cache[require.resolve('../../lib/schedule/scheduleStorage.js')]
  })

  beforeEach(() => {
    fsExistsSyncSpy = jest.spyOn(fs, 'existsSync')
  })

  afterEach(() => {
    fsExistsSyncSpy.mockReset()
  })

  describe('scheduleStorage constructor', () => {
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
        ScheduleStorage()
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
            ScheduleStorage()
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
            ScheduleStorage()
          }).toThrow()
        })
      })
    })

    describe('when the folder already exists', () => {
      beforeEach(() => {
        fsExistsSyncSpy.mockReturnValue(true)
      })

      it('does not call the mkdir function', () => {
        ScheduleStorage()
        expect(fsMkdirSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('scheduleStorage createSchedule method', () => {
    let writeFileSpy
    let readFileSpy
    let scheduleStorage
    const schedule = {
      'id': '0fa87a4f-0916-4194-9b76-0922322ae64b',
      'name': 'test',
      'targetTemperature': [
        24
      ],
      'startTime': [
        '16:00'
      ],
      'endTime': [
        '19:00'
      ],
      'schedulesAppliedOn': [
        '123456789'
      ]
    }

    beforeEach(() => {
      writeFileSpy = jest.spyOn(jsonFile, 'writeFile')
      readFileSpy = jest.spyOn(jsonFile, 'readFile')
      fsExistsSyncSpy.mockReturnValue(true)
      scheduleStorage = new ScheduleStorage()
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

      return scheduleStorage.createSchedule(schedule)
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

        return scheduleStorage.createSchedule(schedule)
          .then(() => {
            expect(readFileSpy).toHaveBeenCalledTimes(1)
          })
      })

      describe('when the jsonfile readFile function succeeds', () => {
        it('returns a resolved promise with the schedule the user wrote', () => {
          writeFileSpy.mockImplementation((path, object, options, cb) => {
            cb()
          })
          readFileSpy.mockImplementation((path, cb) => {
            cb(null, schedule)
          })

          return scheduleStorage.createSchedule(schedule)
            .then(result => {
              expect(result).toEqual(schedule)
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

          return scheduleStorage.createSchedule(schedule)
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

        return scheduleStorage.createSchedule(schedule)
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })
  })

  describe('scheduleStorage getScheduleById method', () => {
    let readFileSpy
    let scheduleStorage
    const schedule = {
      'id': '0fa87a4f-0916-4194-9b76-0922322ae64b',
      'name': 'test',
      'targetTemperature': [
        24
      ],
      'startTime': [
        '16:00'
      ],
      'endTime': [
        '19:00'
      ],
      'schedulesAppliedOn': [
        '123456789'
      ]
    }

    beforeEach(() => {
      readFileSpy = jest.spyOn(jsonFile, 'readFile')
      fsExistsSyncSpy.mockReturnValue(true)
      scheduleStorage = new ScheduleStorage()
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

      return scheduleStorage.getScheduleById('0fa87a4f-0916-4194-9b76-0922322ae64b')
        .then(() => {
          expect(readFileSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('when the jsonfile readFile function succeeds', () => {
      it('returns a resolved promise with the json in the body', () => {
        readFileSpy.mockImplementation((path, cb) => {
          cb(null, schedule)
        })

        return scheduleStorage.getScheduleById()
          .then(result => {
            expect(result).toEqual(schedule)
          })
      })
    })

    describe('when the jsonfile readFile function fails', () => {
      it('returns a rejected promise with the error in the body', () => {
        expect.assertions(1)
        readFileSpy.mockImplementation((path, cb) => {
          cb(new Error('Bang!'), null)
        })

        return scheduleStorage.getScheduleById('0fa87a4f-0916-4194-9b76-0922322ae64b')
          .catch(error => {
            expect(error.message).toEqual('Bang!')
          })
      })
    })
  })
})
