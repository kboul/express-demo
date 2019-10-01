const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose
    .connect('mongodb://localhost/playground', options)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
    const course = new Course({
        name: 'Vue Course',
        author: 'Mosh',
        tags: ['vue', 'frontend'],
        isPublished: false
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (err) {
        console.log(err.message);
    }
};

const getCourses = async () => {
    const allCourses = await Course.find();
    console.log(allCourses);
};

const updateCourseQueryFirst = async id => {
    const course = await Course.findById(id);
    if (!course) return;

    course.isPublished = false;
    course.author = 'Another Author';

    /*
        or course.set({
            isPublised: true,
            author: 'Another Author'
        })
    */

    const result = await course.save();
    console.log(result);
};

const updateCourseUpdateFirst = async id => {
    const result = await Course.update(
        { _id: id },
        {
            $set: {
                author: 'Mosh',
                isPublished: true
            }
        }
    );
    console.log(result);
};

const removeCourse = async id => {
    const result = await Course.deleteOne({ _id: id });
    console.log(result);
};

module.exports = {
    createCourse,
    getCourses,
    updateCourseQueryFirst,
    updateCourseUpdateFirst,
    removeCourse
};
