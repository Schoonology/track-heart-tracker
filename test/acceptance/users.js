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

function generateUserData () {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email()
  }
}

function saveUser (user) {
  return db.table('users').create(user)
}

test.cb('create user', t => {
  var userData = generateUserData()

  supertest(app)
    .post('/users')
    .send({
      data: oja.normalize(spec, 'User', userData)
    })
    .expect(201)
    .expect('Content-Type', /application\/vnd\.api\+json/)
    .expect(match({
      data: {
        id: String,
        type: 'users',
        attributes: userData
      }
    }))
    .end(t.end)
})

test.cb('create user validation: missing username', t => {
  var userData = generateUserData()

  delete userData.username

  supertest(app)
    .post('/users')
    .send({
      data: oja.normalize(spec, 'User', userData)
    })
    .expect(400)
    .end(t.end)
})

test.cb('create user validation: missing email', t => {
  var userData = generateUserData()

  delete userData.email

  supertest(app)
    .post('/users')
    .send({
      data: oja.normalize(spec, 'User', userData)
    })
    .expect(400)
    .end(t.end)
})

test.cb('fetch user', t => {
  var userData = generateUserData()
  var userId = saveUser(userData).id

  supertest(app)
    .get('/users/' + userId)
    .expect(200)
    .expect('Content-Type', /application\/vnd\.api\+json/)
    .expect(match({
      data: {
        id: String,
        type: 'users',
        attributes: userData
      }
    }))
    .end(t.end)
})

test.cb('fetch missing user', t => {
  supertest(app)
    .get('/users/1234')
    .expect(404)
    .end(t.end)
})

test.cb('update user', t => {
  var oldUserData = generateUserData()
  var newUserData = generateUserData()
  var userId = saveUser(oldUserData).id

  supertest(app)
    .put('/users/' + userId)
    .send({
      data: oja.normalize(spec, 'User', newUserData)
    })
    .expect(200)
    .expect('Content-Type', /application\/vnd\.api\+json/)
    .expect(match({
      data: {
        id: String,
        type: 'users',
        attributes: newUserData
      }
    }))
    .end(t.end)
})

test.cb('update missing', t => {
  var newUserData = generateUserData()

  supertest(app)
    .put('/users/1234')
    .send({
      data: oja.normalize(spec, 'User', newUserData)
    })
    .expect(404)
    .end(t.end)
})

test.cb('delete user', t => {
  var userData = generateUserData()
  var userId = saveUser(userData).id

  supertest(app)
    .delete('/users/' + userId)
    .expect(204)
    .end(t.end)
})

test.cb('delete missing', t => {
  supertest(app)
    .delete('/users/1234')
    .expect(404)
    .end(t.end)
})
