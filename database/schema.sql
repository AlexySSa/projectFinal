CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre_completo VARCHAR(150) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  contrasena_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  rol ENUM('arrendador', 'cliente') NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  activo TINYINT(1) DEFAULT 1
);

CREATE TABLE vehiculos (
  id_vehiculo INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  anio YEAR,
  kilometraje INT UNSIGNED NOT NULL,
  estado_visual ENUM('Excelente', 'Bueno', 'Regular', 'Con danos visibles') NOT NULL,
  estado_mecanico ENUM('Optimo', 'Bueno', 'Requiere revision menor', 'Requiere reparacion') NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  plazo_precio ENUM('hora', 'dia', 'semana', 'negociable') NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  contacto_correo VARCHAR(255) NOT NULL,
  contacto_telefono VARCHAR(20) NOT NULL,
  contacto_whatsapp VARCHAR(20),
  descripcion TEXT,
  activo TINYINT(1) DEFAULT 1,
  fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE lista_deseados (
  id_deseado INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_vehiculo INT NOT NULL,
  fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_lista_deseados UNIQUE (id_usuario, id_vehiculo),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo)
);
