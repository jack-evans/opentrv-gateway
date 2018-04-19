
const username = process.env.USER
const password = process.env.PASSWORD

const verifyUserPass = (req, res, next) => {
  console.log(req.headers)
  const authorizationHeader = req.headers['Authorization']

  if (!authorizationHeader) {
    return res.status(403).send({ auth: false, message: 'No Authorization header has been provided.' })
  }

  let encodedToken = authorizationArray.split('')[1]
  let decodedUserPass = Buffer.from(encodedToken, 'base64')

  let userAndPass = decodedUserPass.split(':')

  if (userAndPass[0] !== username || userAndPass[1] !== password) {
    return res.status.send({valid: false, message: 'You are not authorized to access this route'})
  } else {
    next()
  }
}

module.exports = verifyUserPass
