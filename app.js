require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { DB_URL_ADD } = require('./utils/constants');
const router = require('./routes/routes');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimit');

const { PORT = 3000, NODE_ENV, DATABASE_URL } = process.env;

const app = express();
app.use(cors());

app.use(requestLogger);

app.use(rateLimiter);

app.use(bodyParser.json());

app.use(helmet());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : DB_URL_ADD);
app.listen(PORT);
