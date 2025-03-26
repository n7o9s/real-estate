import Property from "../models/Propertyy.js";
import User from "../models/userModel.js";
import { sendEmail } from "../config/sendEmail.js";

export const sendInquiryEmail = async (req, res) => {
    const { message } = req.body;
    const { propertyId } = req.params;

    try {
        const property = await Property.findById(propertyId).populate("listedBy");
        if (!property || !property.listedBy?.email) {
            return res.status(404).json({ error: "Property or seller not found" });
        }

        const buyer = await User.findById(req.user.id);
        if (!buyer) return res.status(404).json({ error: "Buyer not found" });

        const subject = `New Inquiry on "${property.title}"`;
        const html = `
            <p>You received a new inquiry from <strong>${buyer.name}</strong> (${buyer.email}):</p>
            <p>${message}</p>
        `;

        await sendEmail(property.listedBy.email, subject, html);

        res.status(200).json({ message: "📩 Inquiry sent successfully!" });
    } catch (error) {
        console.error("🚨 Error sending inquiry:", error);
        res.status(500).json({ error: "Failed to send inquiry email." });
    }
};
