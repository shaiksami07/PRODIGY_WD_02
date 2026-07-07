const { ApiError } = require('../utils/apiResponse');

/**
 * Role-based access control. Usage: authorize('admin', 'hr')
 * super_admin always passes.
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated'));
    }
    if (req.user.role === 'super_admin') {
      return next();
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
}

module.exports = { authorize };
