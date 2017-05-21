var app = require('../../bin/server')
var obcheckt = require('obcheckt')
var oja = require('open-json-api')
var supertest = require('supertest')
var spec = require('../../spec')
var test = require('ava')

function logBeforeEnd(end) {
  return (err, res) => {
    console.log('%s => %s', res.statusCode, JSON.stringify(res.body, null, 4))
    end(err)
  }
}

function match(format) {
  return (res) => {
    obcheckt.validate(res.body, format)
  }
}

test.cb('create user', t => {
  supertest(app)
    .post('/users')
    .send({
      data: oja.normalize(spec, 'User', {
        username: 'test-user',
        email: 'test@example.com',
      })
    })
    .expect(201)
    .expect(match({
      data: {
        id: String,
        type: 'users',
        attributes: {
          username: 'test-user',
          email: 'test@example.com',
        },
      }
    }))
    .end(t.end)
})

test.cb('create user validation: missing username', t => {
  supertest(app)
    .post('/users')
    .send({
      data: oja.normalize(spec, 'User', {
        email: 'test@example.com',
      })
    })
    .expect(400)
    .end(t.end)
})

test.cb('create user validation: missing email', t => {
  supertest(app)
    .post('/users')
    .send({
      data: oja.normalize(spec, 'User', {
        username: 'test-user',
      })
    })
    .expect(400)
    .end(t.end)
})
