import Property from "../models/Propertyy.js";
import User from "../models/userModel.js";
import { sendEmail } from "../config/sendEmail.js";


export const getProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate("listedBy", "name email");
        res.status(200).json(properties);
    } catch (error) {
        console.error("❌ Error fetching properties:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// fetch sinhgle property by id 
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("listedBy", "name email");
        if (!property) return res.status(404).json({ error: "Property not found" });

        res.json(property);
    } catch (error) {
        console.error("❌ Error fetching property:", error);
        res.status(500).json({ error: "Failed to retrieve property." });
    }
};

// create a property for future updates
export const createProperty = async (req, res) => {
    try {
        console.log("📡 Incoming property listing request...");
        console.log("🔹 User:", req.user);

        if (!req.user || req.user.role !== "seller") {
            console.log("❌ Unauthorized request - Only sellers can list properties");
            return res.status(403).json({ error: "Only sellers can list properties" });
        }

        const { title, price, location, bedrooms, bathrooms, description, type } = req.body;
        if (!title || !price || !location || !bedrooms || !bathrooms || !description || !type) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newProperty = new Property({
            title,
            price,
            location,
            bedrooms,
            bathrooms,
            description,
            type,
            listedBy: req.user.id,
        });

        await newProperty.save();
        console.log("✅ Property saved successfully!", newProperty);

        res.status(201).json({ message: "🏡 Property listed successfully!", property: newProperty });
    } catch (error) {
        console.error("❌ Error listing property:", error);
        res.status(500).json({ error: "Failed to list property." });
    }
};

// update Property (Only Owner) for future updates
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ error: "Property not found" });

        if (property.listedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to update this property" });
        }

        Object.assign(property, req.body);
        await property.save();

        res.json({ message: "🏡 Property updated successfully!", property });
    } catch (error) {
        console.error("❌ Error updating property:", error);
        res.status(500).json({ error: "Failed to update property" });
    }
};

// delete property for future updagts 
export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ error: "Property not found" });

        if (property.listedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized to delete this property" });
        }

        await property.deleteOne();
        res.json({ message: "🏡 Property deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting property:", error);
        res.status(500).json({ error: "Failed to delete property" });
    }
};

// send emails to the seller
export const sendInquiry = async (req, res) => {
    try {
        const { message } = req.body;
        const propertyId = req.params.id;
        const buyerId = req.user.id;

        const property = await Property.findById(propertyId).populate("listedBy", "email name");
        if (!property) return res.status(404).json({ error: "Property not found" });

        const seller = await User.findById(property.listedBy);
        if (!seller) return res.status(404).json({ error: "Seller not found" });

        const buyer = await User.findById(buyerId);
        if (!buyer) return res.status(404).json({ error: "Buyer not found" });

        const subject = `New Inquiry for Your Property: ${property.title}`;
        const html = `
            <p>Hello ${seller.name},</p>
            <p>You have received a new inquiry for your property listing: <strong>${property.title}</strong>.</p>
            <p><strong>Buyer:</strong> ${buyer.name}<br/>
            <strong>Email:</strong> ${buyer.email}</p>
            <p><strong>Message:</strong><br/>${message}</p>
            <p>Please respond as soon as possible.</p>
        `;

        await sendEmail(seller.email, subject, html);

        res.status(200).json({ message: "✅ Inquiry sent successfully to the seller!" });
    } catch (error) {
        console.error("🚨 Error sending inquiry:", error);
        res.status(500).json({ error: "Failed to send inquiry." });
    }
};
