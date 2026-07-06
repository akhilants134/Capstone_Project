const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/seed", adminController.seedAdmin);

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);
router.get("/listings", adminController.getAllListings);
router.delete("/listings/:id", adminController.deleteListing);
router.patch("/listings/:id/status", adminController.toggleListingStatus);

module.exports = router;
