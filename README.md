# 💰 Expense Tracker

A modern, full-stack expense tracking application for managing shared expenses and bills. Built with Node.js, Express, MongoDB, and React.

## 🚀 Features

### Backend Features
- **🔐 JWT Authentication** - Secure user authentication with role-based access control
- **👥 User Management** - Admin and data-entry user roles
- **💳 Bill Management** - Create, update, and manage shared expense bills
- **🧾 Expense Tracking** - Add and categorize individual expenses within bills
- **🏷️ Dynamic Categories** - Configurable expense categories with icons and colors
- **💰 Automatic Calculations** - Bill totals and expense splitting calculations
- **📊 Bill Splitting** - Fair split calculations among contributors
- **🛡️ Security Features** - Rate limiting, input validation, and SQL injection protection
- **📝 Comprehensive Logging** - Structured logging with Winston
- **🔍 API Documentation** - Interactive Swagger/OpenAPI documentation
- **⚡ Performance** - Database indexing and connection pooling

### Frontend Features
- **🎨 Modern UI** - Clean, responsive design with Tailwind CSS
- **📱 Mobile Responsive** - Works seamlessly on desktop and mobile devices
- **🔐 Protected Routes** - Role-based route protection
- **📊 Dashboard** - Overview of bills and expenses with statistics
- **💼 Bill Management** - Create, view, and manage bills with detailed views
- **💸 Expense Management** - Add, edit, and delete expenses with category filtering
- **🔍 Advanced Filtering** - Filter expenses by category, person, and date
- **⚡ Real-time Updates** - Instant UI updates after data modifications

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers
- **winston** - Logging
- **swagger-jsdoc** - API documentation

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd track-expenses
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the server directory:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Logging
   LOG_LEVEL=info
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

   The server will start at `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Environment Configuration**
   
   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## 📚 API Documentation

Once the backend server is running, you can access the interactive API documentation at:

**http://localhost:5000/api-docs**

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Interactive testing interface

## 🔐 API Authentication

Most API endpoints require authentication. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **Admin**: Full access to all features including user management and data deletion
- **Data Entry**: Can create and edit bills and expenses, limited deletion rights

## 🚀 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Bills
- `GET /bills` - Get all bills
- `POST /bills` - Create a new bill
- `GET /bills/:id` - Get bill by ID
- `PUT /bills/:id` - Update bill
- `DELETE /bills/:id` - Delete bill (Admin only)
- `GET /bills/:id/expenses` - Get bill with all expenses
- `GET /bills/:id/split` - Get bill split calculations

### Expenses
- `GET /expenses` - Get all expenses
- `POST /expenses` - Create a new expense
- `GET /expenses/:id` - Get expense by ID
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense (Admin only)
- `GET /expenses/bill/:billId` - Get expenses for a specific bill

### Categories
- `GET /categories` - Get all active categories
- `POST /categories` - Create a new category (Admin only)
- `GET /categories/:id` - Get category by ID
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Deactivate category (Admin only)

## 💡 Usage Examples

### Creating a Bill
```bash
POST /bills
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Weekend Trip",
  "description": "Expenses for our weekend getaway",
  "contributors": [
    {
      "name": "John Doe",
      "amountPaid": 150.00
    },
    {
      "name": "Jane Smith", 
      "amountPaid": 200.00
    }
  ]
}
```

### Adding an Expense
```bash
POST /expenses
Content-Type: application/json
Authorization: Bearer <token>

{
  "bill": "bill_id_here",
  "description": "Hotel accommodation",
  "category": "category_id_here",
  "amount": 200.00,
  "paymentBy": "John Doe"
}
```

## 🔍 Features in Detail

### Bill Splitting
The application automatically calculates fair splits for bills:
- Equal split among all contributors
- Tracks who paid what amount
- Calculates balances (who owes whom)
- Visual indicators for settled/unsettled bills

### Category Management
- Dynamic expense categories with icons and colors
- Default categories: Food, Transportation, Entertainment, Utilities, Shopping
- Admin users can create custom categories
- Categories can be deactivated (soft delete)

### Security Features
- **Rate Limiting**: Prevents API abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **Authentication**: JWT-based with role-based access control
- **Security Headers**: Helmet.js for secure HTTP headers
- **Password Security**: bcrypt hashing with salt rounds

### Logging & Monitoring
- **Structured Logging**: Winston logger with multiple transports
- **HTTP Request Logging**: Automatic logging of all API requests
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance Monitoring**: Request duration tracking

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests  
cd client
npm test
```

### Database Seeding
The application automatically creates default categories on first startup.

### Environment Variables
- **Required**: `MONGO_URI`, `JWT_SECRET`
- **Optional**: `PORT` (default: 5000), `NODE_ENV` (default: development), `LOG_LEVEL` (default: info)

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/api-docs`
- Review the logs in the `server/logs` directory

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection is configured
3. Set `NODE_ENV=production`
4. Deploy using your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Configure environment variables for production API URL

---

**Built with ❤️ using modern web technologies**