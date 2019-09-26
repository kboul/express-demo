const Joi = require('@hapi/joi');

/**
 *
 * @param {Object} course
 * @returns {Object}
 */

const validateCourse = course => {
    // validate
    // if invalid return 400 - Bad request
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .required()
    });

    return schema.validate(course);
};

module.exports = validateCourse;
