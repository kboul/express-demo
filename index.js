const express = require('express');
const app = express();
const validateCourse = require('./utils/validateCourse.js');
const logger = require('./middlewares/logger.js');

// enable parsing of JSON objects
// in the body of the request by
// adding a piece of middleware...
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serve static files
app.use(express.static('assets'));

// custom middleware
app.use(logger);

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        // Bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const {
        params: { id }
    } = req;

    const course = courses.find(c => c.id === parseInt(id));

    if (!course) {
        res.status(404).send(`The course with the id ${id} was not found`);
        return;
    }

    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const {
        params: { id },
        body: { name }
    } = req;

    const course = courses.find(c => c.id === parseInt(id));
    if (!course) {
        res.status(404).send(`The course with the id ${id} was not found`);
        return;
    }

    const { error } = validateCourse(req.body);
    if (error) {
        // Bad request
        res.status(400).send(error.details[0].message);
        return;
    }

    // update course
    course.name = name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const {
        params: { id }
    } = req;

    const course = courses.find(c => c.id === parseInt(id));
    if (!course) {
        res.status(404).send(`The course with the id ${id} was not found`);
        return;
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
