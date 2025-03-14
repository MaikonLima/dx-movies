const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { jwtSecret } = require('../config/auth');

const login = async (username, password) => {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });
  return token;
};

module.exports = {
  login,
};