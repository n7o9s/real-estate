import express from "express";
import { sendInquiryEmail } from "../controllers/inquiryController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();
router.post("/:propertyId/inquiry", authenticate, sendInquiryEmail);

export default router;
