import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    images: [{ type: String }],
    listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
