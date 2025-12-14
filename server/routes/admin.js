const express = require("express");
const admin = require("../middlewares/admin");
const {Product} = require("../model/product");
const Order  = require("../model/order");

const adminRouter = express.Router();

adminRouter.post("/admin/add-product", admin , async (req, res) => {
    try {
        const {name, description , images, quantity, price, category} = req.body;

        let product = new Product({name, description, images, quantity, price, category});

        product = await product.save();

        res.json(product);


    } catch (err) {
        res.status(500).json({error: err.message});
        
    }
});

adminRouter.get("/admin/get-products", admin, async (req, res) => {
    try {
        const products  = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({error : err.message});       
    }
});


adminRouter.get("/admin/get-category-product/:category", admin, async (req, res) => {

    try {
        
        const { category } = req.params;
        let products = await Product.find({
            'category' : category,
        });


        res.json(products);


    } catch (e) {
        res.status(500).json({error : e.message});
    }

});



adminRouter.post("/admin/delete-product", admin , async (req, res) => {
    try {
        const {id} = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);

    } catch (err) {
        res.status(500).json({error : err.message});
    }
});



adminRouter.get("/admin/get-orders", admin , async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (e) {
        res.status(500).json({error : e.message});
    }
});


adminRouter.post("/admin/change-order-status", admin , async (req, res) => {
    try {
        const { status, id } = req.body;

        let order = await Order.findById(id);

        order.status = status;

        order = await order.save();

        res.json(order.status);

    } catch (e) {
        res.status(500).json({error : e.message});

    }
});


adminRouter.get("/admin/analytics", admin, async ( req, res) => {
    try {
        
        const orders = await Order.find({});
        let totalEarnings = 0;

        for( let i = 0; i< orders.length; i++){
            for( let j = 0; j < orders[i].products.length ; j++){
                totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price;
            }
        }

        // CATEGORY WISE ORDERS FETCHING
        let mobileEarnings = await fetchCategoryWiseProductEarning('Mobiles');
        let fashionEarnings = await fetchCategoryWiseProductEarning('Fashion');
        let electronicsEarnings = await fetchCategoryWiseProductEarning('Electronics');
        let homeEarnings = await fetchCategoryWiseProductEarning('Home');
        let beautyEarnings = await fetchCategoryWiseProductEarning('Beauty');
        let appliancesEarnings = await fetchCategoryWiseProductEarning('Appliances');
        let groceryEarnings = await fetchCategoryWiseProductEarning('Grocery');
        let booksEarnings = await fetchCategoryWiseProductEarning('Books');
        let essentialsEarnings = await fetchCategoryWiseProductEarning('Essentials');

        // Map<String, dynamic> ie map of category and its respective earning
        let earnings = {
            totalEarnings,
            mobileEarnings,
            fashionEarnings,
            electronicsEarnings,
            homeEarnings,
            beautyEarnings,
            appliancesEarnings,
            groceryEarnings,
            booksEarnings,
            essentialsEarnings,
        }

        res.json(earnings);

    } catch (e) {
        res.status(500).json({error : e.message});

    }
})


async function fetchCategoryWiseProductEarning(category){
    let earnings = 0;
    let categoryOrders = await Order.find({
        'products.product.category' : category,
    });

    for(let i=0; i<categoryOrders.length; i++){
        for (let j=0; j< categoryOrders[i].products.length; j++){
            earnings += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].product.price;
        }
    }

    return earnings;
}

// Update product featured/trending status
adminRouter.post("/admin/update-product-flags", admin, async (req, res) => {
    try {
        const { id, featured, trending } = req.body;
        
        let product = await Product.findById(id);
        
        if (featured !== undefined) product.featured = featured;
        if (trending !== undefined) product.trending = trending;
        product.updatedAt = Date.now();
        
        product = await product.save();
        
        res.json(product);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Get low stock products
adminRouter.get("/admin/low-stock-products", admin, async (req, res) => {
    try {
        const products = await Product.find({
            $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
        }).sort({ quantity: 1 });
        
        res.json(products);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Update stock threshold
adminRouter.post("/admin/update-stock-threshold", admin, async (req, res) => {
    try {
        const { id, threshold } = req.body;
        
        let product = await Product.findById(id);
        product.lowStockThreshold = threshold;
        product.updatedAt = Date.now();
        
        product = await product.save();
        
        res.json(product);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Duplicate product
adminRouter.post("/admin/duplicate-product", admin, async (req, res) => {
    try {
        const { id } = req.body;
        
        const originalProduct = await Product.findById(id);
        
        if (!originalProduct) {
            return res.status(404).json({error: "Product not found"});
        }
        
        const duplicatedProduct = new Product({
            name: originalProduct.name + " (Copy)",
            description: originalProduct.description,
            images: originalProduct.images,
            quantity: originalProduct.quantity,
            price: originalProduct.price,
            category: originalProduct.category,
            featured: false,
            trending: false,
            lowStockThreshold: originalProduct.lowStockThreshold,
        });
        
        const savedProduct = await duplicatedProduct.save();
        
        res.json(savedProduct);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Update product stock
adminRouter.post("/admin/update-product-stock", admin, async (req, res) => {
    try {
        const { id, quantity } = req.body;
        
        let product = await Product.findById(id);
        product.quantity = quantity;
        product.updatedAt = Date.now();
        
        product = await product.save();
        
        res.json(product);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});


module.exports = adminRouter;