var oja = require('open-json-api')

var spec = {
  swagger: '2.0',
  info: {
    title: require('../package.json').name,
    version: require('../package.json').version
  },
  tags: [{
    name: 'Tracks'
  }, {
    name: 'Users'
  }],
  paths: {
    '/tracks': {
      'x-swagger-router-controller': 'tracks',
      post: {
        operationId: 'create',
        tags: ['Tracks'],
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
                    $ref: '#/definitions/Track'
                  }, {
                    type: 'object',
                    properties: {
                      attributes: {
                        type: 'object',
                        required: ['artist', 'title']
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
                  $ref: '#/definitions/Track'
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
    '/tracks/{trackId}': {
      'x-swagger-router-controller': 'tracks',
      get: {
        operationId: 'read',
        tags: ['Tracks'],
        parameters: [
          {
            name: 'trackId',
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
                  $ref: '#/definitions/Track'
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
            description: 'Failed to find the requested Track.',
            schema: {}
          }
        }
      },
      put: {
        operationId: 'update',
        tags: ['Tracks'],
        parameters: [
          {
            name: 'trackId',
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
                  $ref: '#/definitions/Track'
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
                  $ref: '#/definitions/Track'
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
            description: 'Failed to find the requested Track.',
            schema: {}
          }
        }
      },
      delete: {
        operationId: 'delete',
        tags: ['Tracks'],
        parameters: [
          {
            name: 'trackId',
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
            description: 'Failed to find the requested Track.',
            schema: {}
          }
        }
      }
    },
    '/users': {
      'x-swagger-router-controller': 'users',
      post: {
        operationId: 'create',
        tags: ['Users'],
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
        tags: ['Users'],
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
        tags: ['Users'],
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
        tags: ['Users'],
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

spec = oja.defineResource(spec, 'Track', {
  type: 'tracks',
  attributes: {
    artist: {
      type: 'string',
      maxLength: 127
    },
    album: {
      type: 'string',
      maxLength: 255
    },
    title: {
      type: 'string',
      maxLength: 255
    }
  },
  links: ['spotify']
})

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
  },
  relationships: {
    jam: 'Track'
  }
})

module.exports = spec
