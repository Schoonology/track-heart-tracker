var db = require('../db')
var oja = require('open-json-api')

module.exports = class TracksController {
  create (req, res) {
    var spec = req.swagger.swaggerObject
    var data = req.swagger.params.body.value.data

    data = oja.flatten(data)
    data = db.table('tracks').create(data)

    res.status(201).send({
      data: oja.normalize(spec, 'Track', data)
    })
  }

  read (req, res) {
    var spec = req.swagger.swaggerObject
    var trackId = req.swagger.params.trackId.value

    var data = db.table('tracks').fetch(trackId)

    if (data == null) {
      return res.status(404).send()
    }

    res.status(200).send({
      data: oja.normalize(spec, 'Track', data)
    })
  }

  update (req, res) {
    var spec = req.swagger.swaggerObject
    var data = req.swagger.params.body.value.data
    var trackId = req.swagger.params.trackId.value

    if (db.table('tracks').fetch(trackId) == null) {
      return res.status(404).send()
    }

    data = db.table('tracks').update(trackId, data)

    res.status(200).send({
      data: oja.normalize(spec, 'Track', data)
    })
  }

  delete (req, res) {
    var trackId = req.swagger.params.trackId.value

    if (db.table('tracks').fetch(trackId) == null) {
      return res.status(404).send()
    }

    db.table('tracks').remove(trackId)

    res.status(204).send()
  }
}
