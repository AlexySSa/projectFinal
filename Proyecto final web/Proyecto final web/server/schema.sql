CREATE DATABASE IF NOT EXISTS bahn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bahn;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(40),
  rol ENUM('cliente', 'arrendador') NOT NULL DEFAULT 'cliente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(190) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  marca VARCHAR(80),
  modelo VARCHAR(80),
  anio INT,
  km INT,
  condicion VARCHAR(60),
  color VARCHAR(60),
  tarifa DECIMAL(10, 2) NOT NULL DEFAULT 0,
  descripcion TEXT,
  direccion VARCHAR(190),
  direccion_completa VARCHAR(255),
  placa VARCHAR(60),
  titular VARCHAR(150),
  peso VARCHAR(40),
  fotos LONGTEXT,
  owner_id INT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS favoritos (
  usuario_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, vehiculo_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehiculo_id INT NOT NULL,
  usuario_id INT,
  inicio DATE NOT NULL,
  fin DATE NOT NULL,
  dias INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  nombre VARCHAR(150),
  metodo VARCHAR(40) DEFAULT 'PayPal',
  estado VARCHAR(40) DEFAULT 'pendiente',
  paypal_order_id VARCHAR(100),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
