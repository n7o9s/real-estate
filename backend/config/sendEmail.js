import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, html) => {
    const msg = {
        to,
        from: "myworkenviroment79@gmail.com",
        subject,
        html,
    };
    //debuging
    try {
        await sgMail.send(msg);
        console.log("✅ Email sent to:", to);
    } catch (error) {
        console.error("🚨 Error sending email:", error.response?.body || error.message);
    }
};
