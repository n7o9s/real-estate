import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    sendInquiry
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.post("/", authenticate, createProperty);
router.put("/:id", authenticate, updateProperty);
router.delete("/:id", authenticate, deleteProperty);

router.post("/:id/inquiry", authenticate, sendInquiry);

export default router;
