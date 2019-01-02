const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    questions: [{
        body: String,
        RA: String,
        WA1: String,
        WA2: String,
        WA3: String
    }],
    score: {
        type: Number
    }
});

// Create collection and add schema
mongoose.model('exams', ExamSchema);