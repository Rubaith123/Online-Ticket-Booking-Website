const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    tickets: [{
        name: {
            type: String
        },
        email: {
            type: String
        },
        date: {
            type: String
        }
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;