const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const usuario = await authService.autenticarUsuario(correo, contrasenia);
        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
        res.status(401).json({ error: 'No autorizado', detalle: error.message });
    }
};

module.exports = { login };