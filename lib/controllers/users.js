var db = require('../db')
var oja = require('open-json-api')

module.exports = class UsersController {
  create (req, res) {
    var spec = req.swagger.swaggerObject
    var data = req.swagger.params.body.value.data

    data = oja.flatten(data)
    data = db.table('users').create(data)

    res.status(201).send({
      data: oja.normalize(spec, 'User', data)
    })
  }

  read (req, res) {
    var spec = req.swagger.swaggerObject
    var userId = req.swagger.params.userId.value

    var data = db.table('users').fetch(userId)

    if (data == null) {
      return res.status(404).send()
    }

    res.status(200).send({
      data: oja.normalize(spec, 'User', data)
    })
  }

  update (req, res) {
    var spec = req.swagger.swaggerObject
    var data = req.swagger.params.body.value.data
    var userId = req.swagger.params.userId.value

    if (db.table('users').fetch(userId) == null) {
      return res.status(404).send()
    }

    data = oja.flatten(data)
    data = db.table('users').update(userId, data)

    res.status(200).send({
      data: oja.normalize(spec, 'User', data)
    })
  }

  delete (req, res) {
    var userId = req.swagger.params.userId.value

    if (db.table('users').fetch(userId) == null) {
      return res.status(404).send()
    }

    db.table('users').remove(userId)

    res.status(204).send()
  }

  goToJam (req, res) {
    var userId = req.swagger.params.userId.value
    var userData = db.table('users').fetch(userId)

    if (userData == null) {
      return res.status(404).send('No such user.')
    }

    var jam = userData.jam

    if (!jam || !jam.id) {
      return res.status(404).send('User has no jam.')
    }

    var trackData = db.table('tracks').fetch(jam.id)

    if (!trackData || !trackData.spotify) {
      return res.status(404).send('Jam has no link')
    }

    res.redirect(trackData.spotify)
  }
}
