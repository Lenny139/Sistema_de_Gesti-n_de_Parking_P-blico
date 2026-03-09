import swaggerJSDoc, { type OAS3Options } from 'swagger-jsdoc'

const options: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema Parking API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/**/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
