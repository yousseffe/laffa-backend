const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    nameEn: { type: String, required: true },
    nameAr: { type: String, required: true },
    nameFr: { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
