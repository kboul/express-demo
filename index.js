const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const startupDebugger = require('debug')('app:startup');

const logger = require('./middlewares/logger.js');
const home = require('./routes/home');
const courses = require('./routes/courses');
const crud = require('./crud');

// enable parsing of JSON objects
// in the body of the request by
// adding a piece of middleware...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serve static files
app.use(express.static('assets'));
app.use(helmet());

app.use(logger);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled');
}

app.use('/', home);
// use this router when api endpoints start with /api/courses
app.use('/api/courses', courses);

console.log(`Application name: ${config.get('name')}`);
// console.log(`Application name: ${config.mail.host}`);
// should declare env variable app_DB_passwordbefore
// console.log(`DB password: ${config.DB.password}`);

// use template engine
app.set('view engine', 'pug');
app.set('views', './views'); // default views folder should be in the route of the app

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
