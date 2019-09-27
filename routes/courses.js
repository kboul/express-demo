const express = require('express');
const router = express.Router();

const validateCourse = require('../utils/validateCourse.js');

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

router.get('/', (req, res) => {
    res.send(courses);
});

router.post('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;
