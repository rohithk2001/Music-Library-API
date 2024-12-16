// const checkRole = (requiredRoles) => {
//   return (req, res, next) => {
//     // Ensure that requiredRoles is an array
//     if (!Array.isArray(requiredRoles)) {
//       requiredRoles = [requiredRoles];
//     }

//     if (!requiredRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: `Access denied. ${requiredRoles.join(' or ')} role(s) required.` });
//     }

//     next();
//   };
// };

// module.exports = { checkRole };
