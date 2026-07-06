const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────
const cookieName = "jwt";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 90 * 24 * 60 * 60 * 1000,
};

// AES-256-CBC key for encrypting TOTP secrets at rest.
// In production, set TWO_FACTOR_ENCRYPTION_KEY to a 64-hex-char string.
const getEncryptionKey = () => {
  const envKey = process.env.TWO_FACTOR_ENCRYPTION_KEY;
  if (envKey && /^[0-9a-fA-F]{64}$/.test(envKey)) {
    return Buffer.from(envKey, "hex");
  }
  // Dev fallback — deterministic so restarts don't break existing secrets
  if (!getEncryptionKey._devKey) {
    console.warn(
      "[2FA] TWO_FACTOR_ENCRYPTION_KEY not set — using deterministic dev key. Set this in production!"
    );
    getEncryptionKey._devKey = crypto.scryptSync(
      "dev-only-fallback-key-change-in-prod",
      "resourcematch-salt",
      32
    );
  }
  return getEncryptionKey._devKey;
};

const encryptSecret = (plaintext) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

const decryptSecret = (ciphertext) => {
  const [ivHex, encHex] = ciphertext.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", getEncryptionKey(), iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
};

// ─────────────────────────────────────────────────────────────────────────────
// JWT helpers
// ─────────────────────────────────────────────────────────────────────────────
const JWT_SECRET =
  process.env.JWT_SECRET || "super-secret-and-ultra-long-development-key-12345";

const parseCookies = (cookieHeader = "") =>
  cookieHeader.split(";").reduce((cookies, part) => {
    const [rawName, ...rest] = part.trim().split("=");
    if (!rawName) return cookies;
    const name = rawName.trim();
    if (!name) return cookies;
    cookies[name] = decodeURIComponent(rest.join("=") || "");
    return cookies;
  }, {});

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: "90d" });

// Short-lived token issued when 2FA is required — carries the user ID only
// and is only useful to pass to the /2fa/verify endpoint.
const signPreAuthToken = (id) =>
  jwt.sign({ id, pre2fa: true }, JWT_SECRET, { expiresIn: "10m" });

const setAuthCookie = (res, token) => {
  res.cookie(cookieName, token, cookieOptions);
};

const clearAuthCookie = (res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Backup code helpers
// ─────────────────────────────────────────────────────────────────────────────
const BACKUP_CODE_COUNT = 8;

const generateBackupCodes = () =>
  Array.from({ length: BACKUP_CODE_COUNT }, () =>
    crypto.randomBytes(5).toString("hex").toUpperCase()
  );

const hashBackupCodes = async (codes) =>
  Promise.all(codes.map((c) => bcrypt.hash(c, 10)));

const verifyBackupCode = async (plainCode, hashedCodes) => {
  for (let i = 0; i < hashedCodes.length; i++) {
    if (await bcrypt.compare(plainCode.toUpperCase(), hashedCodes[i])) {
      return i; // return index so we can remove it
    }
  }
  return -1;
};

// ─────────────────────────────────────────────────────────────────────────────
// Standard auth
// ─────────────────────────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      category: req.body.category,
      bio: req.body.bio,
      location: req.body.location,
    });

    const token = signToken(newUser._id);
    setAuthCookie(res, token);
    newUser.password = undefined;

    res.status(201).json({ status: "success", token, data: { user: newUser } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password!" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: "fail", message: "Incorrect email or password" });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        status: "fail",
        message: "Admin accounts must sign in through the admin portal.",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        status: "fail",
        message: "This account has been suspended. Contact support for help.",
      });
    }

    // If 2FA is enabled, send a pre-auth token instead of a full session
    if (user.twoFactorEnabled) {
      const preAuthToken = signPreAuthToken(user._id);
      user.password = undefined;
      return res.status(200).json({
        status: "success",
        requires2FA: true,
        preAuthToken,
        data: { user: { _id: user._id, name: user.name, email: user.email } },
      });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);
    user.password = undefined;

    res.status(200).json({ status: "success", token, data: { user } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: "fail", message: "Please provide email and password!" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: "fail", message: "Incorrect email or password" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "This portal is restricted to administrator accounts.",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        status: "fail",
        message: "This admin account has been suspended.",
      });
    }

    const token = signToken(user._id);
    setAuthCookie(res, token);
    user.password = undefined;

    res.status(200).json({ status: "success", token, data: { user } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ status: "success" });
};

exports.getMe = async (req, res) => {
  res.status(200).json({ status: "success", data: { user: req.user } });
};

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token && req.headers.cookie) {
      const cookies = parseCookies(req.headers.cookie);
      token = cookies[cookieName];
    }
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ status: "fail", message: "You are not logged in!" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ status: "fail", message: "Invalid token. Please log in again." });
    }

    // Reject pre-auth tokens from reaching protected routes
    if (decoded.pre2fa) {
      return res.status(401).json({ status: "fail", message: "Please complete 2FA verification." });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ status: "fail", message: "User no longer exists" });
    if (user.isBanned) {
      clearAuthCookie(res);
      return res.status(403).json({
        status: "fail",
        message: "This account has been suspended.",
      });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ status: "fail", message: "Invalid session" });
  }
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ status: "fail", message: "You do not have permission." });
  }
  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// 2FA — verify code during login (uses pre-auth token)
// ─────────────────────────────────────────────────────────────────────────────
exports.verify2FA = async (req, res) => {
  try {
    const { preAuthToken, code } = req.body;
    if (!preAuthToken || !code) {
      return res.status(400).json({ status: "fail", message: "Token and code are required." });
    }

    let decoded;
    try {
      decoded = jwt.verify(preAuthToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ status: "fail", message: "Session expired. Please log in again." });
    }

    if (!decoded.pre2fa) {
      return res.status(401).json({ status: "fail", message: "Invalid pre-auth token." });
    }

    const user = await User.findById(decoded.id).select("+twoFactorSecret +twoFactorBackupCodes");
    if (!user || !user.twoFactorEnabled) {
      return res.status(401).json({ status: "fail", message: "2FA not enabled for this user." });
    }

    // Try TOTP code first
    const decryptedSecret = decryptSecret(user.twoFactorSecret);
    const isValidTOTP = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: "base32",
      token: code.replace(/\s/g, ""),
      window: 1, // Allow ±30s clock drift
    });

    if (isValidTOTP) {
      const fullToken = signToken(user._id);
      setAuthCookie(res, fullToken);
      const safeUser = await User.findById(user._id);
      return res.status(200).json({ status: "success", token: fullToken, data: { user: safeUser } });
    }

    // Try backup code
    const backupIndex = await verifyBackupCode(code, user.twoFactorBackupCodes || []);
    if (backupIndex !== -1) {
      // Remove the used backup code
      user.twoFactorBackupCodes.splice(backupIndex, 1);
      await user.save({ validateBeforeSave: false });
      const fullToken = signToken(user._id);
      setAuthCookie(res, fullToken);
      const safeUser = await User.findById(user._id);
      return res.status(200).json({
        status: "success",
        token: fullToken,
        usedBackupCode: true,
        remainingBackupCodes: user.twoFactorBackupCodes.length,
        data: { user: safeUser },
      });
    }

    return res.status(401).json({ status: "fail", message: "Invalid verification code." });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2FA — setup (generate secret + QR code)
// ─────────────────────────────────────────────────────────────────────────────
exports.setup2FA = async (req, res) => {
  try {
    const user = req.user;

    // Generate a new TOTP secret
    const secret = speakeasy.generateSecret({
      name: `ResourceMatch (${user.email})`,
      issuer: "ResourceMatch",
      length: 20,
    });

    // Generate QR code as a data URI (never stored — only sent once)
    const qrDataUri = await QRCode.toDataURL(secret.otpauth_url);

    // Store the secret temporarily encrypted — it's only "activated" when the
    // user confirms with a valid code in the /2fa/enable step.
    // We'll store it in twoFactorSecret even before enabling, so /enable can verify.
    const encrypted = encryptSecret(secret.base32);
    await User.findByIdAndUpdate(user._id, {
      twoFactorSecret: encrypted,
      twoFactorEnabled: false, // not enabled until confirmed
    });

    res.status(200).json({
      status: "success",
      data: {
        qrCode: qrDataUri,
        manualCode: secret.base32, // shown as fallback for users who can't scan
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2FA — enable (confirm the user has successfully set up their authenticator)
// ─────────────────────────────────────────────────────────────────────────────
exports.enable2FA = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ status: "fail", message: "Verification code is required." });
    }

    const user = await User.findById(req.user._id).select("+twoFactorSecret");
    if (!user.twoFactorSecret) {
      return res.status(400).json({ status: "fail", message: "Please set up 2FA first." });
    }

    const decryptedSecret = decryptSecret(user.twoFactorSecret);
    const isValid = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: "base32",
      token: code.replace(/\s/g, ""),
      window: 1,
    });

    if (!isValid) {
      return res.status(400).json({ status: "fail", message: "Invalid code. Please try again." });
    }

    // Generate and hash backup codes
    const plainBackupCodes = generateBackupCodes();
    const hashedCodes = await hashBackupCodes(plainBackupCodes);

    await User.findByIdAndUpdate(user._id, {
      twoFactorEnabled: true,
      twoFactorBackupCodes: hashedCodes,
    });

    res.status(200).json({
      status: "success",
      message: "2FA has been enabled successfully.",
      data: {
        // Plain backup codes — shown ONCE, then only hashed versions stored
        backupCodes: plainBackupCodes,
      },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2FA — disable
// ─────────────────────────────────────────────────────────────────────────────
exports.disable2FA = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ status: "fail", message: "Verification code is required to disable 2FA." });
    }

    const user = await User.findById(req.user._id).select("+twoFactorSecret +twoFactorBackupCodes");
    if (!user.twoFactorEnabled) {
      return res.status(400).json({ status: "fail", message: "2FA is not enabled." });
    }

    const decryptedSecret = decryptSecret(user.twoFactorSecret);
    const isValidTOTP = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: "base32",
      token: code.replace(/\s/g, ""),
      window: 1,
    });

    const isValidBackup = !isValidTOTP
      ? (await verifyBackupCode(code, user.twoFactorBackupCodes || [])) !== -1
      : false;

    if (!isValidTOTP && !isValidBackup) {
      return res.status(401).json({ status: "fail", message: "Invalid code. Cannot disable 2FA." });
    }

    await User.findByIdAndUpdate(user._id, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: [],
    });

    res.status(200).json({ status: "success", message: "2FA has been disabled." });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2FA — regenerate backup codes
// ─────────────────────────────────────────────────────────────────────────────
exports.regenerateBackupCodes = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ status: "fail", message: "Verification code is required." });
    }

    const user = await User.findById(req.user._id).select("+twoFactorSecret");
    if (!user.twoFactorEnabled) {
      return res.status(400).json({ status: "fail", message: "2FA is not enabled." });
    }

    const decryptedSecret = decryptSecret(user.twoFactorSecret);
    const isValid = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: "base32",
      token: code.replace(/\s/g, ""),
      window: 1,
    });

    if (!isValid) {
      return res.status(401).json({ status: "fail", message: "Invalid code." });
    }

    const plainBackupCodes = generateBackupCodes();
    const hashedCodes = await hashBackupCodes(plainBackupCodes);
    await User.findByIdAndUpdate(user._id, { twoFactorBackupCodes: hashedCodes });

    res.status(200).json({
      status: "success",
      data: { backupCodes: plainBackupCodes },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
