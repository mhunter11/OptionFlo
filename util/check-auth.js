const {AuthenticationError} = require('apollo-server')
var admin = require('firebase-admin')

var serviceAccount = require('../config.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL,
})

module.exports.checkAuth = async context => {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try {
<<<<<<< HEAD
        const decodedToken = await admin.auth().verifyIdToken(token)
        const uid = decodedToken.uid
        const user = await admin.auth().getUser(uid)
        return user
=======
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        const user = await admin.auth().getUser(uid);
        return user;
>>>>>>> 688306920d184ef922357f06153120849bf8cace
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]")
  }
  throw new Error('Authorization header must be provided')
}

<<<<<<< HEAD
module.exports.admin = admin
=======
module.exports.admin = admin;
>>>>>>> 688306920d184ef922357f06153120849bf8cace
