import express from 'express';
import bodyParser from 'body-parser';  
import cors from 'cors';
import routes from './modules/routes';
import { errorHandler } from './middlewares';
// import { notFoundHandler } from './middlewares/notFoundHandler';
import morgan from 'morgan';
import { swaggerUi, specs } from './config/swagger';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
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