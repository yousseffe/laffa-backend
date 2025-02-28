const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const multer = require('multer');
const { uploadProduct } = require('../uploadFile');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all products
router.get('/', asyncHandler(async (req, res) => {
    try {
        const products = await Product.find()
            .populate('proCategoryId', 'id nameEn nameAr nameFr')
            .populate('proSubCategoryId', 'id nameEn nameAr nameFr');
        res.json({ success: true, message: "Products retrieved successfully.", data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Get a product by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const productID = req.params.id;
        const product = await Product.findById(productID)
            .populate('proCategoryId', 'id nameEn nameAr nameFr')
            .populate('proSubCategoryId', 'id nameEn nameAr nameFr');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product retrieved successfully.", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// get all favorite product
router.get('/favorite', asyncHandler(async (req, res) => {
    try {
        const product = await Product.findOne({ _id: productID, favorite: { $gt: 0 } })
            .populate('proCategoryId', 'id nameEn')
            .populate('proSubCategoryId', 'id nameEn');

        if (!product) {
            return res.status(404).json({ success: false, message: "No favorite product found." });
        }

        res.json({ success: true, message: "Favorite product retrieved successfully.", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// Create new product
router.post('/', asyncHandler(async (req, res) => {
    try {
        uploadProduct.fields([
            { name: 'image1', maxCount: 1 },
            { name: 'image2', maxCount: 1 },
            { name: 'image3', maxCount: 1 },
            { name: 'image4', maxCount: 1 },
            { name: 'image5', maxCount: 1 }
        ])(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB per image.';
                }
                console.log(`Add product: ${err}`);
                return res.json({ success: false, message: err.message });
            } else if (err) {
                console.log(`Add product: ${err}`);
                return res.json({ success: false, message: err });
            }

            const { nameEn, nameAr, nameFr, descriptionEn, descriptionAr, descriptionFr, price, offerPrice, proCategoryId, proSubCategoryId } = req.body;

            if (!nameEn || !nameAr || !nameFr || !descriptionEn || !descriptionAr || !descriptionFr || !price || !proCategoryId) {
                console.log("Required fields are missing.");
                return res.status(400).json({ success: false, message: "Required fields are missing." });
            }

            const imageUrls = [];
            const fields = ['image1', 'image2', 'image3', 'image4', 'image5'];
            fields.forEach((field, index) => {
                if (req.files[field] && req.files[field].length > 0) {
                    const file = req.files[field][0];
                    const imageUrl = `http://localhost:3000/image/products/${file.filename}`;
                    imageUrls.push({ image: index + 1, url: imageUrl });
                }
            });

            const newProduct = new Product({
                nameEn,
                nameAr,
                nameFr,
                descriptionEn,
                descriptionAr,
                descriptionFr,
                price,
                offerPrice,
                proCategoryId,
                proSubCategoryId: isValidObjectId(proSubCategoryId) ? proSubCategoryId : null,
                images: imageUrls
            });

            await newProduct.save();
            res.json({ success: true, message: "Product created successfully.", data: null });
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Update a product
router.put('/:id', asyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
        uploadProduct.fields([
            { name: 'image1', maxCount: 1 },
            { name: 'image2', maxCount: 1 },
            { name: 'image3', maxCount: 1 },
            { name: 'image4', maxCount: 1 },
            { name: 'image5', maxCount: 1 }
        ])(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size is too large. Maximum filesize is 5MB per image.';
                }
                console.log(`Update product: ${err}`);
                return res.json({ success: false, message: err.message });
            } else if (err) {
                console.log(`Update product: ${err}`);
                return res.json({ success: false, message: err });
            }

            const { nameEn, nameAr, nameFr, descriptionEn, descriptionAr, descriptionFr, price, offerPrice, proCategoryId, proSubCategoryId } = req.body;

            const productToUpdate = await Product.findById(productId);
            if (!productToUpdate) {
                return res.status(404).json({ success: false, message: "Product not found." });
            }

            productToUpdate.nameEn = nameEn || productToUpdate.nameEn;
            productToUpdate.nameAr = nameAr || productToUpdate.nameAr;
            productToUpdate.nameFr = nameFr || productToUpdate.nameFr;
            productToUpdate.descriptionEn = descriptionEn || productToUpdate.descriptionEn;
            productToUpdate.descriptionAr = descriptionAr || productToUpdate.descriptionAr;
            productToUpdate.descriptionFr = descriptionFr || productToUpdate.descriptionFr;
            productToUpdate.price = price || productToUpdate.price;
            productToUpdate.offerPrice = offerPrice || productToUpdate.offerPrice;
            productToUpdate.proCategoryId = proCategoryId || productToUpdate.proCategoryId;
            productToUpdate.proSubCategoryId = isValidObjectId(proSubCategoryId) ? proSubCategoryId : productToUpdate.proSubCategoryId;

            const fields = ['image1', 'image2', 'image3', 'image4', 'image5'];
            fields.forEach((field, index) => {
                if (req.files[field] && req.files[field].length > 0) {
                    const file = req.files[field][0];
                    const imageUrl = `http://localhost:3000/image/products/${file.filename}`;
                    let imageEntry = productToUpdate.images.find(img => img.image === (index + 1));
                    if (imageEntry) {
                        imageEntry.url = imageUrl;
                    } else {
                        productToUpdate.images.push({ image: index + 1, url: imageUrl });
                    }
                }
            });

            await productToUpdate.save();
            res.json({ success: true, message: "Product updated successfully." });
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete a product
router.delete('/:id', asyncHandler(async (req, res) => {
    const productID = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(productID);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
router.put('/favorite/:productId', asyncHandler(async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findByIdAndUpdate(
            productId,
            { $inc: { favorite: 1 } }, // Increment favorite by 1
            { new: true } // Return the updated document
        ).populate('proCategoryId', 'id nameEn')
            .populate('proSubCategoryId', 'id nameEn');

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        res.json({ success: true, message: "Favorite count increased.", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;