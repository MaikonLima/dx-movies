const authService = require('../services/authService');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await authService.login(username, password);
    res.json({ token });
  } catch (error) {
    console.error("Erro durante o login:", error);
    res.status(401).json({ error: error.message });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Erro durante o registro:", error);
    res.status(400).json({ error: "Erro ao registrar usuário" });
  }
};

module.exports = {
  login,
  register,
};