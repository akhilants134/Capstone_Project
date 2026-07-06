const User = require("../models/userModel");
const Listing = require("../models/listingModel");

const ADMIN_EMAIL = "admin@resourcematch.com";
const ADMIN_PASSWORD = "Admin@123456";

const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalListings, pendingRequests, matchCountAgg] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ type: "request", status: "active" }),
      Listing.aggregate([
        { $project: { matchCount: { $size: "$matches" } } },
        { $group: { _id: null, totalMatches: { $sum: "$matchCount" } } },
      ]),
    ]);

    const totalMatches = matchCountAgg[0]?.totalMatches || 0;

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalUsers,
          totalListings,
          totalMatches,
          pendingRequests,
        },
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = (req.query.search || "").trim();

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email role points createdAt")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["client", "donor", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ status: "fail", message: "Invalid role provided." });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found." });
    }

    user.role = role;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ status: "fail", message: "You cannot delete your own account." });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found." });
    }

    await Listing.deleteMany({ user: req.params.id });

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const search = (req.query.search || "").trim();

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("user", "name email role")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      Listing.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      results: listings.length,
      data: {
        listings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ status: "fail", message: "Listing not found." });
    }

    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.toggleListingStatus = async (req, res) => {
  try {
    const requestedStatus = req.body.status;
    let status = req.body.isActive === false ? "cancelled" : "active";

    if (requestedStatus === "active") status = "active";
    if (requestedStatus === "inactive") status = "cancelled";

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ status: "fail", message: "Listing not found." });
    }

    listing.status = status;
    await listing.save();

    res.status(200).json({
      status: "success",
      data: { listing },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.seedAdmin = async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        status: "fail",
        message: "Admin seed route is disabled in production.",
      });
    }

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(200).json({
        status: "success",
        message: "Admin user already exists.",
        data: {
          user: {
            _id: existingAdmin._id,
            email: existingAdmin.email,
            role: existingAdmin.role,
          },
        },
      });
    }

    const adminUser = await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      category: "financial",
      bio: "Default seeded administrator account",
    });

    res.status(201).json({
      status: "success",
      message: "Admin user seeded successfully.",
      data: {
        credentials: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          role: "admin",
        },
        user: {
          _id: adminUser._id,
          email: adminUser.email,
          role: adminUser.role,
        },
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
