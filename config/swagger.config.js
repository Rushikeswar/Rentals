import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rentals Pro API',
      version: '1.0.0',
      description: 'Equipment Rental Management System API Documentation'
    },
	servers: [
      {
        url:'http://localhost:3000',
        description: 'API Server'
      },
      {
        url: process.env.VITE_BACKEND_URL || 'http://13.201.99.37:3000',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        userAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'user_id'
        },
        managerAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'user_id'
        },
        adminAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'user_id'
        }
      }
    }
  },
  apis: [
    './docs/routes/auth.routes.js',
    './docs/routes/product.routes.js',
    './docs/routes/review.routes.js',
    './docs/routes/user.routes.js',
    './docs/routes/manager.routes.js',
    './docs/routes/admin.routes.js',
    './docs/schemas/*.js'
  ]
};

export const specs = swaggerJsdoc(options);
