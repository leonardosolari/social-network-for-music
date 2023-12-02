const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['../app.js']
const doc = {
    info: {
      title: "Social Network for Music API",
      description: "Social Network for Music REST API"
    }
  }

swaggerAutogen(outputFile, endpointsFiles, doc)