const express = require("express");
const router = express.Router();
const Category = require("../models/category.js");

// Lấy danh sách categories
router.get("/group", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/// Thêm category mới
router.post("/add_group", async (req, res) => {
    try {
        const { category, categoryDesc } = req.body;

        if (!category) {
            return res.status(400).json({ error: "Tên category không được để trống" });
        }

        const existingCategory = await Category.findOne({ category });
        if (existingCategory) {
            return res.status(400).json({ error: "Category đã tồn tại" });
        }

        const newCategory = new Category({ category, categoryDesc });
        await newCategory.save();

        res.json({ message: "New Category Added", category: newCategory });
    } catch (err) {
        res.status(500).json({ error: "Lỗi server", details: err.message });
    }
});

module.exports = router;
