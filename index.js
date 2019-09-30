const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const mongoose = require('mongoose');

const logger = require('./middlewares/logger.js');
const home = require('./routes/home');
const courses = require('./routes/courses');

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

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose
    .connect('mongodb://localhost/playground', options)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        isPublished: true
    });
    const result = await course.save();
    console.log(result);
};

// createCourse();

const getCourses = async () => {
    const allCourses = await Course.find();
    console.log(allCourses);
};

getCourses();

// use template engine
app.set('view engine', 'pug');
app.set('views', './views'); // default views folder should be in the route of the app

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
