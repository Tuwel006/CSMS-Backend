import express from 'express';
import cors from 'cors';
import routes from './modules/routes';
import { errorHandler } from './middlewares';
// import { notFoundHandler } from './middlewares/notFoundHandler';
import morgan from 'morgan';
import { swaggerUi, specs } from './config/swagger';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: ['http://localhost:5000','http://localhost:5173', 'http://127.0.0.1:5000', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CSMS API Documentation'
}));

app.use('/api', routes);

// Error handler should be the last middleware
app.use(errorHandler);

export default app;