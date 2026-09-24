const sequelize = require('../config/database');
const Carrera = require('../models/Carrera');
const EstadoLista = require('../models/EstadoLista');
const RolDirectivo = require('../models/RolDirectivo');
const RolDeParticipacion = require('../models/Rol_de_participacion');
const Documento = require('../models/Documento');
const PeriodosEscolares = require('../models/Periodos_Escolares');
const Lugar = require('../models/Lugar');

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida para el seeder.');

        await sequelize.sync({ alter: true });
        console.log('Tablas verificadas/creadas con éxito.');

        await Carrera.bulkCreate([
            { NombreCarrera: 'Ingeniería de Software' },
            { NombreCarrera: 'Ciencia de Datos' },
            { NombreCarrera: 'Redes y Servicios de Cómputo' },
            { NombreCarrera: 'Tecnologías de la Información' }
        ], { ignoreDuplicates: true }); 

        await RolDirectivo.bulkCreate([
            { Nombre_Rol: 'Director de factuldad' },
            { Nombre_Rol: 'Secretario Académico' },
            { Nombre_Rol: 'Jefe de Carrera' }
        ], { ignoreDuplicates: true });

        await EstadoLista.bulkCreate([
            { EstadoNombre: 'Borrador' },
            { EstadoNombre: 'Registrado' },
            { EstadoNombre: 'Aprobado' },
            { EstadoNombre: 'Generado' },
            { EstadoNombre: 'Finalizado' }
        ], { ignoreDuplicates: true });

        await RolDeParticipacion.bulkCreate([
            { NombreRol: 'Director' },
            { NombreRol: 'Codirector' },
            { NombreRol: 'Presidente' },
            { NombreRol: 'Secretario' },
            { NombreRol: 'Vocal' },
            { NombreRol: 'Sinodal' }
        ], { ignoreDuplicates: true }); 

        await Documento.bulkCreate([
            { NombreDocumento: 'Comprobante de no adeudo de servicios bibliotecarios' },
            { NombreDocumento: 'Arancel de pago para trámite de certificado de estudios' },
            { NombreDocumento: 'Copia de acta de nacimiento' },
            { NombreDocumento: 'Copia de CURP' },
            { NombreDocumento: '5 fotografías tamaño credencial (ovaladas) blanco y negro' },
            { NombreDocumento: 'Copia de Oficio de autorización de publicación (impresión)' },
            { NombreDocumento: 'Copia de Oficio de VoBo de directores y sinodales aprobatorios (impresión)' },
            { NombreDocumento: 'Copia de Oficio de aval de Documento Electrónico (impresión)' }
        ], { ignoreDuplicates: true }); 

        await PeriodosEscolares.bulkCreate([
            { Fecha_inicio: '2026-02-01', Fecha_fin: '2026-07-31', Nomenclatura: 'Feb-Jul 2026' },
            { Fecha_inicio: '2026-08-01', Fecha_fin: '2027-01-31', Nomenclatura: 'Ago-Ene 2027' }
        ], { ignoreDuplicates: true });

        await Lugar.bulkCreate([
            { Nombre: 'Auditorio FEI', Estado: 'disponible' },
            { Nombre: 'Salon Cristal', Estado: 'disponible' },
            { Nombre: 'Salon Murales', Estado: 'disponible' },
            { Nombre: 'Audiovisual', Estado: 'disponible' },
            { Nombre: 'Centro de Cómputo', Estado: 'no_disponible' }
        ], { ignoreDuplicates: true });

        console.log('Seeders ejecutados correctamente. Base de datos poblada.');
        process.exit();
    } catch (error) {
        console.error('Error ejecutando los seeders:', error);
        process.exit(1);
    }
};

seedData();