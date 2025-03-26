import express from "express";
import authenticate from "../middleware/authenticate.js";
import Favorite from "../models/Favorite.js";
import Property from "../models/Propert.js";

const router = express.Router();

// add Property to favorites for future updates. 
router.post("/", authenticate, async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user.userId;

        // check if the property exists
        const propertyExists = await Property.findById(propertyId);
        if (!propertyExists) {
            return res.status(404).json({ error: "Property not found" });
        }

        // check if the property is already favorited
        const existingFavorite = await Favorite.findOne({ userId, propertyId });
        if (existingFavorite) {
            return res.status(400).json({ error: "Property already in favorites" });
        }

        // save favorite property
        const favorite = new Favorite({ userId, propertyId });
        await favorite.save();

        res.status(201).json({ message: "Property added to favorites" });
    } catch (error) {
        console.error("Error adding to favorites:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// users favorite properties for future updates 
router.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;


        const favorites = await Favorite.find({ userId }).populate("propertyId");

        res.json(favorites);
    } catch (error) {
        console.error("Error fetching favorite properties:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// remove property from favorites for future updates
router.delete("/:propertyId", authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { propertyId } = req.params;

        const favorite = await Favorite.findOne({ userId, propertyId });
        if (!favorite) {
            return res.status(404).json({ error: "Favorite property not found" });
        }

        await Favorite.deleteOne({ userId, propertyId });

        res.json({ message: "Property removed from favorites" });
    } catch (error) {
        console.error("Error removing favorite property:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
