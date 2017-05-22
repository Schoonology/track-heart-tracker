var FAKE_DB = {}
var lastId = 0

module.exports = {
  generateId () {
    return String(lastId++)
  },
  table: function (name) {
    FAKE_DB[name] = FAKE_DB[name] || {}

    return {
      create (value) {
        if (FAKE_DB[name][value.id]) {
          throw new Error('Value exists')
        }
        if (!value.id) {
          value = Object.assign({ id: module.exports.generateId() }, value)
        }
        FAKE_DB[name][value.id] = value
        return this.fetch(value.id)
      },
      fetch (id) {
        return FAKE_DB[name][id] || null
      },
      update (id, patch) {
        var value = FAKE_DB[name][id]
        if (!value) {
          throw new Error('No such value')
        }
        Object.assign(value, patch)
        return this.fetch(id)
      },
      remove (id) {
        var value = this.fetch(id)
        if (!value) {
          throw new Error('No such value')
        }
        delete FAKE_DB[name][id]
        return value
      }
    }
  }
}
