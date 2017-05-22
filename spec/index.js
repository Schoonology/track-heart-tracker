var oja = require('open-json-api')

var spec = {
  swagger: '2.0',
  info: {
    title: require('../package.json').name,
    version: require('../package.json').version
  },
  paths: {
    '/users': {
      'x-swagger-router-controller': 'users',
      post: {
        operationId: 'create',
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['data'],
              properties: {
                data: {
                  allOf: [{
                    $ref: '#/definitions/User'
                  }, {
                    type: 'object',
                    properties: {
                      attributes: {
                        type: 'object',
                        required: ['username', 'email']
                      }
                    }
                  }]
                }
              }
            }
          }
        ],
        responses: {
          201: {
            description: 'Successful response.',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                data: {
                  $ref: '#/definitions/User'
                },
                included: {
                  type: 'array',
                  items: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/users/{userId}': {
      'x-swagger-router-controller': 'users',
      get: {
        operationId: 'read',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'Successful response.',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                data: {
                  $ref: '#/definitions/User'
                },
                included: {
                  type: 'array',
                  items: {
                    type: 'object'
                  }
                }
              }
            }
          },
          404: {
            description: 'Failed to find the requested User.',
            schema: {}
          }
        }
      },
      put: {
        operationId: 'update',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            type: 'string'
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['data'],
              properties: {
                data: {
                  $ref: '#/definitions/User'
                }
              }
            }
          }
        ],
        responses: {
          200: {
            description: 'Successful response.',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                data: {
                  $ref: '#/definitions/User'
                },
                included: {
                  type: 'array',
                  items: {
                    type: 'object'
                  }
                }
              }
            }
          },
          404: {
            description: 'Failed to find the requested User.',
            schema: {}
          }
        }
      },
      delete: {
        operationId: 'delete',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            type: 'string'
          }
        ],
        responses: {
          204: {
            description: 'Successful response.',
            schema: {}
          },
          404: {
            description: 'Failed to find the requested User.',
            schema: {}
          }
        }
      }
    }
  }
}

spec = oja.defineResource(spec, 'User', {
  type: 'users',
  attributes: {
    username: {
      type: 'string',
      maxLength: 40
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 255
    }
  }
})

module.exports = spec
