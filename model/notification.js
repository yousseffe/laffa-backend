const mongoose = require('mongoose');

// Define the Notification schema
const notificationSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },

}, { timestamps: true });

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
