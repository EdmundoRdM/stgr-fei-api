const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const Carrera = require('./models/Carrera');
const EstadoLista = require('./models/EstadoLista');
const RolDirectivo = require('./models/RolDirectivo');
const RolDeParticipacion = require('./models/Rol_de_participacion');
const Documento = require('./models/Documento');
const PeriodosEscolares = require('./models/Periodos_Escolares');
const Lugar = require('./models/Lugar');
const Academico = require('./models/Academico');
const academicoRoutes = require('./routes/academicoRoutes');
const Estudiante = require('./models/Estudiante');
const estudianteRoutes = require('./routes/estudianteRoutes');
const TrabajoRecepcional = require('./models/TrabajoRecepcional');
const trabajoRoutes = require('./routes/trabajoRoutes');
const authRoutes = require('./routes/authRoutes');
const ParticipantesTrabajo = require('./models/ParticipantesTrabajo');
const EstudianteTrabajo = require('./models/EstudianteTrabajo');
const participanteRoutes = require('./routes/participanteRoutes');

// Modelos del módulo de Secretaría y Gestión Documental
const SecretariaGrupo = require('./models/SecretariaGrupo');
const BitacoraAcciones = require('./models/BitacoraAcciones');
const EstudianteDocumento = require('./models/EstudianteDocumento');

// Rutas del módulo de Secretaría y Gestión Documental
const secretariaRoutes = require('./routes/secretariaRoutes');
const bitacoraRoutes = require('./routes/bitacoraRoutes');
const documentoRoutes = require('./routes/documentoRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const yaml = require('yaml');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Documentación de la API (Swagger UI)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.get('/api/docs.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.send(yaml.stringify(swaggerSpec));
});

app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/academicos', academicoRoutes);
app.use('/api/trabajos', trabajoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/participantes', participanteRoutes);
app.use('/api/participantes-trabajo', participanteRoutes);
app.use('/api/secretarias', secretariaRoutes);
app.use('/api/bitacora', bitacoraRoutes);
app.use('/api/documentos', documentoRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API del SGTR-FEI en funcionamiento' });
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a MySQL establecida exitosamente.');
        
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados con la base de datos.');
        
        app.listen(PORT, () => {
            console.log(`Servidor de la API ejecutándose en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al arrancar:', error);
    }
};

startServer();