
const username = process.env.USER
const password = process.env.PASSWORD

const verifyUserPass = (req, res, next) => {
  const authorizationHeader = req.headers['authorization']

  if (!authorizationHeader) {
    return res.status(401).send({ auth: false, message: 'No Authorization header has been provided.' })
  }

  let encodedToken = authorizationHeader.split(' ')[1]
  let decodedUserPass = Buffer.from(encodedToken, 'base64').toString('utf8')
  let userAndPass = decodedUserPass.split(':')

  if (userAndPass[0] !== username || userAndPass[1] !== password) {
    return res.status(401).send({valid: false, message: 'You are not authorized to access this route'})
  } else {
    next()
  }
}

module.exports = verifyUserPass
