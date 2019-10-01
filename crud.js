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
    name: { type: String, required: true, minlength: 5, maxlength: 255 },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'A course should have at least one tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() {
            return this.isPublished;
        },
        min: 10,
        max: 200
    }
});

const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
    const course = new Course({
        name: 'jQuery',
        category: 'Web',
        author: 'Mosh',
        tags: ['frontend'],
        isPublished: true,
        price: 11
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        const { errors } = ex;
        Object.keys(errors).forEach(key => {
            if (errors) {
                console.log(ex.errors[key].message);
            }
        });
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
