import Listing from "../models/Listing.js";

// create a lsaisting
export const createListing = async (req, res) => {
    try {
        const { title, price, location, bedrooms, bathrooms, description, type, images } = req.body;

        if (!title || !price || !location || !bedrooms || !bathrooms || !description || !type) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newListing = new Listing({
            title,
            price,
            location,
            bedrooms,
            bathrooms,
            description,
            type,
            images: images || [],
            listedBy: req.user.id,
        });

        await newListing.save();
        res.status(201).json({ message: "✅ Listing created successfully!", listing: newListing });
    } catch (error) {
        console.error("❌ Error creating listing:", error);
        res.status(500).json({ error: "Failed to create listing." });
    }
};

// fetch all listing
export const getListings = async (req, res) => {
    try {
        const listings = await Listing.find();
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Fetch Single Listing by ID
export const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ error: "Listing not found" });

        res.json(listing);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve listing." });
    }
};
