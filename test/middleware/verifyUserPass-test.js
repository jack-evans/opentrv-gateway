import toBeType from 'jest-tobetype'

const httpMocks = require('node-mocks-http')

expect.extend(toBeType)

describe('middleware/verifyUserPass.js', () => {
  let req
  let res
  let verifyUserPass

  describe('when the authorization header is not present', () => {
    beforeEach(() => {
      req = httpMocks.createRequest({
        method: 'GET',
        path: '/test'
      })
      res = httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
      verifyUserPass = require('../../lib/middleware/verifyUserPass')
    })

    afterEach(() => {
      delete require.cache[require.resolve('../../lib/middleware/verifyUserPass')]
    })

    it('returns 401', (done) => {
      res.on('end', () => {
        try {
          expect(res._getStatusCode()).toEqual(401)
          done()
        } catch (e) {
          done(e)
        }
      })

      verifyUserPass(req, res, () => {})
    })

    it('returns an object', (done) => {
      res.on('end', () => {
        try {
          expect(res._getData()).toBeType('object')
          done()
        } catch (e) {
          done(e)
        }
      })

      verifyUserPass(req, res, () => {})
    })
  })
})
