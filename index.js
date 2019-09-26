const express = require('express');

const app = express();

app.get('/', (req, res) => {
    console.log(req);
    console.log(res);
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3]);
});

const port = 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
