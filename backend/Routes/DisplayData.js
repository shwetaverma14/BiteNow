const express = require('express');
const router = express.Router();

router.post('/foodData', (req, res) => {
    try {
        if (!global.food_items || !global.food_category) {
            return res.status(500).json({ error: "Food data or category data not loaded yet" });
        }

        // console.log("Food data fetched:", global.food_items);
        // console.log("Food categories fetched:", global.food_category);

        res.json({ 
            foodItems: global.food_items, 
            foodCategory: global.food_category 
        });

    } catch (error) {
        console.error("Error fetching food data:", error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
