const logging = require('../../lib/utils/logging.js')

describe('uitls/logging.js', () => {
  let fakeLogger

  beforeEach(() => {
    fakeLogger = {
      info: () => {},
      error: () => {}
    }
  })

  describe('logFunctionEntry', () => {
    let infoSpy

    beforeEach(() => {
      infoSpy = jest.spyOn(fakeLogger, 'info')
    })

    afterEach(() => {
      infoSpy.mockReset()
    })

    afterAll(() => {
      infoSpy.mockRestore()
    })

    describe('when the function is not an internal function', () => {
      beforeEach(() => {
        logging.logFunctionEntry(fakeLogger, 'testFunction', false, {})
      })

      it('does not get called with internal in the string', () => {
        expect(infoSpy.mock.calls[0][0]).not.toContain('internal')
      })
    })

    describe('when the function is an internal function', () => {
      beforeEach(() => {
        logging.logFunctionEntry(fakeLogger, 'testFunction', true, {})
      })

      it('does get called with internal in the string', () => {
        expect(infoSpy.mock.calls[0][0]).toContain('internal')
      })
    })
  })

  describe('logErrorCase', () => {
    let errorSpy

    beforeEach(() => {
      errorSpy = jest.spyOn(fakeLogger, 'error')
    })

    afterEach(() => {
      errorSpy.mockReset()
    })

    afterAll(() => {
      errorSpy.mockRestore()
    })

    describe('when the errorObject contains 400', () => {
      it('is called with bad request in the string', () => {
        logging.logErrorCase(fakeLogger, 'testFunction', {statusCode: 400})
        expect(errorSpy.mock.calls[0][0]).toContain('bad request')
      })
    })

    describe('when the errorObject contains 404', () => {
      it('is called with not found in the string', () => {
        logging.logErrorCase(fakeLogger, 'testFunction', {statusCode: 404})
        expect(errorSpy.mock.calls[0][0]).toContain('not found')
      })
    })

    describe('when the errorObject contains 409', () => {
      it('is called with conflict in the string', () => {
        logging.logErrorCase(fakeLogger, 'testFunction', {statusCode: 409})
        expect(errorSpy.mock.calls[0][0]).toContain('conflict')
      })
    })

    describe('when the errorObject contains 500', () => {
      it('is called with internal server error in the string', () => {
        logging.logErrorCase(fakeLogger, 'testFunction', {statusCode: 500})
        expect(errorSpy.mock.calls[0][0]).toContain('internal server error')
      })
    })

    describe('when the errorObject contains another number', () => {
      it('is called with unexpected error in the string', () => {
        logging.logErrorCase(fakeLogger, 'testFunction', {statusCode: 503})
        expect(errorSpy.mock.calls[0][0]).toContain('unexpected error')
      })
    })
  })
})
