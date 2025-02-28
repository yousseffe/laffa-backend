const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nameEn: {
        type: String,
        required: [true, 'English Name is required'],
        trim: true
    },
    nameAr: {
        type: String,
        required: [true, 'Arabic Name is required'],
        trim: true
    },
    nameFr: {
        type: String,
        required: [true, 'French Name is required'],
        trim: true
    },
    descriptionEn: {
        type: String,
        trim: true
    },
    descriptionAr: {
        type: String,
        trim: true
    },
    descriptionFr: {
        type: String,
        trim: true
    },
    favorite:{
      type: Number,
      default: 0
    },
    price: {
        type: Number,
        required: true
    },
    offerPrice: {
        type: Number
    },
    proCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    proSubCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: false,
        validate: {
            validator: function(v) {
                return v == null || mongoose.Types.ObjectId.isValid(v);
            },
            message: props => `${props.value} is not a valid ObjectId!`
        }
    },
    images: [{
        image: {
            type: Number,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;