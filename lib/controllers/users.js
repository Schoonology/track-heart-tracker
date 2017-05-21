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
}
