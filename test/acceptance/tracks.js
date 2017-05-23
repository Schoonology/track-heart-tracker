var app = require('../../bin/server')
var db = require('../../lib/db')
var faker = require('faker')
var obcheckt = require('obcheckt')
var oja = require('open-json-api')
var supertest = require('supertest')
var spec = require('../../spec')
var test = require('ava')

// eslint-disable-next-line no-unused-vars
function logBeforeEnd (end) {
  return (err, res) => {
    console.log('%s => %s', res.statusCode, JSON.stringify(res.body, null, 4))
    end(err)
  }
}

function match (format) {
  return (res) => {
    obcheckt.validate(res.body, format)
  }
}

function generateTrackData () {
  return {
    artist: faker.finance.currencyCode(),
    album: faker.hacker.phrase(),
    title: faker.commerce.productName()
  }
}

function saveTrack (track) {
  return db.table('tracks').create(track)
}

test.cb('create track', t => {
  var trackData = generateTrackData()

  supertest(app)
    .post('/tracks')
    .send({
      data: oja.normalize(spec, 'Track', trackData)
    })
    .expect(201)
    .expect('Content-Type', /application\/vnd\.api\+json/)
    .expect(match({
      data: {
        id: String,
        type: 'tracks',
        attributes: trackData
      }
    }))
    .end(t.end)
})

test.cb('create track validation: missing artist', t => {
  var trackData = generateTrackData()

  delete trackData.artist

  supertest(app)
    .post('/tracks')
    .send({
      data: oja.normalize(spec, 'Track', trackData)
    })
    .expect(400)
    .end(t.end)
})

test.cb('create track validation: missing album', t => {
  var trackData = generateTrackData()

  delete trackData.album

  supertest(app)
    .post('/tracks')
    .send({
      data: oja.normalize(spec, 'Track', trackData)
    })
    .expect(201)
    .expect('Content-Type', /application\/vnd\.api\+json/)
    .expect(match({
      data: {
        id: String,
        type: 'tracks',
        attributes: trackData
      }
    }))
    .end(t.end)
})

test.cb('create track validation: missing title', t => {
  var trackData = generateTrackData()

  delete trackData.title

  supertest(app)
    .post('/tracks')
    .send({
      data: oja.normalize(spec, 'Track', trackData)
    })
    .expect(400)
    .end(t.end)
})

test.cb('create track validation: extra field', t => {
  var trackData = generateTrackData()
  var trackBody = oja.normalize(spec, 'Track', trackData)

  trackBody.attributes.extra = true

  supertest(app)
    .post('/tracks')
    .send({
      data: trackBody
    })
    .expect(400)
    .end(t.end)
})

test.cb('fetch track', t => {
  var trackData = generateTrackData()
  var trackId = saveTrack(trackData).id

  supertest(app)
    .get('/tracks/' + trackId)
    .expect(200)
    .expect('Content-Type', /application\/vnd\.api\+json/)
    .expect(match({
      data: {
        id: String,
        type: 'tracks',
        attributes: trackData
      }
    }))
    .end(t.end)
})

test.cb('fetch missing track', t => {
  supertest(app)
    .get('/tracks/1234')
    .expect(404)
    .end(t.end)
})

test.cb('update track', t => {
  var oldTrackData = generateTrackData()
  var newTrackData = generateTrackData()
  var trackId = saveTrack(oldTrackData).id

  supertest(app)
    .put('/tracks/' + trackId)
    .send({
      data: oja.normalize(spec, 'Track', newTrackData)
    })
    .expect(200)
    .expect('Content-Type', /application\/vnd\.api\+json/)
    .expect(match({
      data: {
        id: String,
        type: 'tracks',
        attributes: newTrackData
      }
    }))
    .end(t.end)
})

test.cb('update track validation: extra field', t => {
  var oldTrackData = generateTrackData()
  var newTrackData = generateTrackData()
  var trackId = saveTrack(oldTrackData).id
  var trackBody = oja.normalize(spec, 'Track', newTrackData)

  trackBody.attributes.extra = true

  supertest(app)
    .put('/tracks/' + trackId)
    .send({
      data: trackBody
    })
    .expect(400)
    .end(t.end)
})

test.cb('update missing', t => {
  var newTrackData = generateTrackData()

  supertest(app)
    .put('/tracks/1234')
    .send({
      data: oja.normalize(spec, 'Track', newTrackData)
    })
    .expect(404)
    .end(t.end)
})

test.cb('update track\'s spotify link', t => {
  var userData = generateTrackData()
  var trackId = saveTrack(userData).id

  supertest(app)
    .put('/tracks/' + trackId)
    .send({
      data: oja.normalize(spec, 'Track', {
        links: {
          spotify: 'test-spotify-url'
        }
      })
    })
    .expect(200)
    .expect('Content-Type', /application\/vnd\.api\+json/)
    .expect(match({
      data: {
        id: String,
        type: 'tracks',
        attributes: userData,
        links: {
          spotify: 'test-spotify-url'
        }
      }
    }))
    .end(t.end)
})

test.cb('delete track', t => {
  var trackData = generateTrackData()
  var trackId = saveTrack(trackData).id

  supertest(app)
    .delete('/tracks/' + trackId)
    .expect(204)
    .end(t.end)
})

test.cb('delete missing', t => {
  supertest(app)
    .delete('/tracks/1234')
    .expect(404)
    .end(t.end)
})
