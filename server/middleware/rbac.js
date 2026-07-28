/**
 * Layer 4: Auth & Permissions
 * Role-Based Access Control (RBAC) & Permission Scoping
 */

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : 'user';
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
