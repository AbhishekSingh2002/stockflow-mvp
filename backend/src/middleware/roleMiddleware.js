const { Role } = require("@prisma/client");

/**
 * Role-based access control middleware
 * 
 * Permission levels:
 * - VIEWER: Can only view dashboard data and financial records
 * - ANALYST: Can view records, access insights, and create summaries
 * - ADMIN: Can create, update, and manage records and users
 */

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: "Insufficient permissions",
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

// Predefined role checks
const requireViewer = requireRole([Role.VIEWER, Role.ANALYST, Role.ADMIN]);
const requireAnalyst = requireRole([Role.ANALYST, Role.ADMIN]);
const requireAdmin = requireRole([Role.ADMIN]);

// Permission checker utility
const hasPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    [Role.VIEWER]: 1,
    [Role.ANALYST]: 2,
    [Role.ADMIN]: 3
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

module.exports = {
  requireRole,
  requireViewer,
  requireAnalyst,
  requireAdmin,
  hasPermission
};
