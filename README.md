# CSMS Backend API

A comprehensive Customer Service Management System backend built with Node.js, Express, and TypeScript.

## 🚀 Features

- **Authentication System**: User registration and login with JWT tokens
- **Beautiful API Documentation**: Interactive Swagger UI documentation
- **Type Safety**: Built with TypeScript for better development experience
- **Database Integration**: Sequelize ORM with MySQL
- **Security**: Password hashing with bcrypt
- **Error Handling**: Comprehensive error handling middleware

## 📚 API Documentation

Once the server is running, you can access the beautiful interactive API documentation at:

**http://localhost:3000/api-docs**

The documentation includes:
- Complete endpoint descriptions
- Request/response schemas
- Interactive testing interface
- Authentication examples
- Error response examples

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in `.env`
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📖 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login

Visit `/api-docs` for complete interactive documentation!

## 🔧 Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server