const mongoose = require('mongoose');

// Define the SubCategory schema
const subCategorySchema = new mongoose.Schema({
    nameEn: {
        type: String,
        required: [true, 'English Name is required'], // Adding custom error message
        trim: true
    },
    nameAr: {
        type: String,
        required: [true, 'Arabic Name is required'], // Adding custom error message
        trim: true
    },
    nameFr: {
        type: String,
        required: [true, 'French Name is required'], // Adding custom error message
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // This should match the model name you use when you create the Category model
        required: [true, 'Category ID is required']
    }
},{ timestamps: true });

// Create the SubCategory model
const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;

