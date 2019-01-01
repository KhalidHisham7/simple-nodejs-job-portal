const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    acceptApplications: {
        type: Boolean,
        default: true
    },
    applications: [{
        applicant: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        cv: {}
    }],
    employer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

// Create collection and add schema
mongoose.model('jobs', JobSchema);