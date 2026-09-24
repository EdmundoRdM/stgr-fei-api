-- Migración: Modificar Fecha_defensa de DATE a DATETIME en TrabajoRecepcional
-- Sistema de Gestión de Trabajos Recepcionales (SGTR-FEI)

ALTER TABLE `TrabajoRecepcional` 
MODIFY COLUMN `Fecha_defensa` DATETIME NULL DEFAULT NULL;
