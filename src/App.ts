import express from 'express';
import bodyParser from 'body-parser';  
import cors from 'cors';
import routes from './modules/routes';
import { errorHandler } from './middlewares';
// import { notFoundHandler } from './middlewares/notFoundHandler';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
// app.use(bodyParser);

app.use('/api', routes);

// Error handler should be the last middleware
app.use(errorHandler);

export default app;