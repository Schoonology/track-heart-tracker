var express = require('express')
var swaggerTools = require('swagger-tools')

/**
 * Returns an Express subapplication capable of handling the OpenAPI spec
 * provided as `options.spec`.
 *
 * NOTE: This is an expensive, blocking operation, and its result should be
 * cached. Usually, this is accomplished with `server.use(swagger(...))`.
 */
function swagger (options) {
  var subapp = express()

  // Validates our Swagger document, getting the Swagger version-specific
  // middleware functions via callback function. Their description for each piece
  // of middleware is inlined. Further information is available:
  //
  // https://github.com/apigee-127/swagger-tools/blob/master/docs/Middleware.md
  // eslint-disable-next-line no-shadow
  swaggerTools.initializeMiddleware(options.spec, (swagger) => {
    // "This is the base middleware that will analyze a request route, match it
    // to an API in your Swagger document(s) and then annotate the request,
    // using req.swagger, with the pertinent details."
    subapp.use(swagger.swaggerMetadata())

    // "This middleware will validate your request/responses based on the
    // operations in your Swagger document(s)."
    subapp.use(swagger.swaggerValidator({
      validateResponse: true
    }))

    // "This middleware allows you to wire up request handlers based on the
    // operation definitions in your Swagger document(s)."
    subapp.use(swagger.swaggerRouter({
      controllers: Reflect.ownKeys(options.controllers)
        .reduce((handlers, name) => {
          Reflect.ownKeys(Object.getPrototypeOf(options.controllers[name]))
            .concat(Reflect.ownKeys(options.controllers[name]))
            .forEach((key) => {
              handlers[name + '_' + key] = (req, res, next) => {
                options.controllers[name][key](req, res, next)
              }
            })

          return handlers
        }, {})
    }))

    // "This middleware will serve your Swagger document(s) for public
    // consumption and will also serve a local Swagger UI instance."
    subapp.use(swagger.swaggerUi({
      swaggerUi: '/documentation',
      apiDocs: '/docs'
    }))
  })

  return subapp
}

module.exports = swagger
