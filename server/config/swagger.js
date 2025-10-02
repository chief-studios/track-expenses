const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'A comprehensive API for tracking shared expenses and bills',
      contact: {
        name: 'API Support',
        email: 'support@expensetracker.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.expensetracker.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'username', 'password', 'role'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            role: {
              type: 'string',
              enum: ['admin', 'data-entry'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Bill: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'string',
              description: 'Bill ID'
            },
            title: {
              type: 'string',
              description: 'Bill title'
            },
            description: {
              type: 'string',
              description: 'Bill description'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Bill date'
            },
            createdBy: {
              $ref: '#/components/schemas/User'
            },
            contributors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: {
                    $ref: '#/components/schemas/User'
                  },
                  name: {
                    type: 'string'
                  },
                  amountPaid: {
                    type: 'number'
                  },
                  amountOwed: {
                    type: 'number'
                  }
                }
              }
            },
            totalAmount: {
              type: 'number',
              description: 'Total bill amount'
            },
            isSettled: {
              type: 'boolean',
              description: 'Whether the bill is settled'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Category: {
          type: 'object',
          required: ['name', 'displayName'],
          properties: {
            id: {
              type: 'string',
              description: 'Category ID'
            },
            name: {
              type: 'string',
              description: 'Category name (lowercase, unique)'
            },
            displayName: {
              type: 'string',
              description: 'Category display name'
            },
            description: {
              type: 'string',
              description: 'Category description'
            },
            icon: {
              type: 'string',
              description: 'Category icon name'
            },
            color: {
              type: 'string',
              description: 'Category color (hex)'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the category is active'
            },
            createdBy: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Expense: {
          type: 'object',
          required: ['bill', 'category', 'amount', 'paymentBy'],
          properties: {
            id: {
              type: 'string',
              description: 'Expense ID'
            },
            bill: {
              $ref: '#/components/schemas/Bill'
            },
            description: {
              type: 'string',
              description: 'Expense description'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Expense date'
            },
            category: {
              $ref: '#/components/schemas/Category'
            },
            amount: {
              type: 'number',
              minimum: 0.01,
              description: 'Expense amount'
            },
            paymentBy: {
              type: 'string',
              description: 'Person who paid for the expense'
            },
            submittedBy: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Path to the API files
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
