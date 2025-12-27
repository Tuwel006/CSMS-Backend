"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./modules/routes"));
const middlewares_1 = require("./middlewares");
// import { notFoundHandler } from './middlewares/notFoundHandler';
const morgan_1 = __importDefault(require("morgan"));
const swagger_1 = require("./config/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:5173',
    'http://127.0.0.1:5000'
];
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use(bodyParser);
// Root health check route
app.get('/', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'CSMS Backend is running',
        uptime: process.uptime()
    });
});
// Swagger Documentation
app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CSMS API Documentation'
}));
app.use('/api', routes_1.default);
// Error handler should be the last middleware
app.use(middlewares_1.errorHandler);
exports.default = app;
