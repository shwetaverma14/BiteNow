const mongoose = require("mongoose");

const mongoDb = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://shwetaverma1404040:aayebade@cluster0.u7mim.mongodb.net/Mymealsmern",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        console.log("Connected to MongoDB");

        // Fetch collections
        const foodItemsCollection = mongoose.connection.db.collection("food_items");
        const foodCategoryCollection = mongoose.connection.db.collection("foodCategory");

        // Fetch data asynchronously
        const foodItems = await foodItemsCollection.find({}).toArray();
        const foodCategories = await foodCategoryCollection.find({}).toArray();

        // Store data globally
        global.food_items = foodItems;
        global.food_category = foodCategories;

        console.log("Food items and categories fetched successfully");

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = mongoDb;
