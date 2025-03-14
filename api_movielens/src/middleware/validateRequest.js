const { body, validationResult } = require("express-validator");

const validateLoginRequest = [
  body("username").notEmpty().withMessage("Nome de usuário é obrigatório"),
  body("password").notEmpty().withMessage("Senha é obrigatória"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateLoginRequest };
