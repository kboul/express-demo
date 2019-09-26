const express = require('express');

const app = express();

// enable parsing of JSON objects
// in the body of the request by
// adding a piece of middleware...
app.use(express.json());

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

    const selectedCourse = courses.find(course => course.id === parseInt(id));

    if (!selectedCourse) {
        res.status(404).send(`The course with the id ${id} was not found`);
    }

    res.send(selectedCourse);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
