var db = require('../../lib/db')
var test = require('ava')

function createId () {
  return String(Math.random()).slice(2)
}

function createValue () {
  return {
    key: 'value'
  }
}

test('generateId', t => {
  t.is(typeof db.generateId(), 'string')
})

test('generateId unique', t => {
  t.not(db.generateId(), db.generateId())
})

test('table new', t => {
  var table = db.table('new-table')

  t.truthy(table)
  t.is(typeof table.create, 'function')
  t.is(typeof table.fetch, 'function')
  t.is(typeof table.update, 'function')
  t.is(typeof table.remove, 'function')
})

test('table existing', t => {
  db.table('existing-table')

  var table = db.table('existing-table')

  t.truthy(table)
  t.is(typeof table.create, 'function')
  t.is(typeof table.fetch, 'function')
  t.is(typeof table.update, 'function')
  t.is(typeof table.remove, 'function')
})

test('create new', t => {
  db.table('test').create(createValue())

  t.pass()
})

test('create new does not mutate', t => {
  var value = createValue()

  db.table('test').create(value)

  t.is(value.id, undefined)
})

test('create existing', t => {
  var value = db.table('test').create(createValue())

  t.throws(() => {
    db.table('test').create(value)
  })
})

test('fetch existing', t => {
  var value = db.table('test').create(createValue())

  t.is(db.table('test').fetch(value.id), value)
})

test('fetch missing', t => {
  t.is(db.table('test').fetch(db.generateId()), null)
})

test('update complete', t => {
  var oldValue = db.table('test').create(createValue())
  var newValue = createValue()

  newValue.id = oldValue.id

  db.table('test').update(oldValue.id, newValue)

  t.deepEqual(db.table('test').fetch(oldValue.id), newValue)
})

test('update partial', t => {
  var oldValue = db.table('test').create(createValue())

  db.table('test').update(oldValue.id, { 'new-key': 'new-value' })

  t.is(db.table('test').fetch(oldValue.id).key, 'value')
  t.is(db.table('test').fetch(oldValue.id)['new-key'], 'new-value')
})

test('update missing', t => {
  t.throws(() => {
    db.table('test').update(createId(), createValue())
  })
})

test('remove existing', t => {
  var value = db.table('test').create(createValue())

  db.table('test').remove(value.id)

  t.pass()
})

test('remove missing', t => {
  t.throws(() => {
    db.table('test').remove(createId())
  })
})
