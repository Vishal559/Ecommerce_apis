const Cart = require("../models/cart");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Product = require("../models/product");


exports.createCart = BigPromise(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new CustomError("No product found with this id", 401));
    }



    res.status(200).json({
      success: true,
      order,
    });
  });