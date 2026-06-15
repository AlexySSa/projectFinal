CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(40),
  dui VARCHAR(10),
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

CREATE TABLE IF NOT EXISTS facturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(40) NOT NULL UNIQUE,
  reserva_id INT,
  usuario_id INT,
  nombre_cliente VARCHAR(150),
  email_cliente VARCHAR(190),
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  impuesto DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  moneda VARCHAR(10) NOT NULL DEFAULT 'USD',
  metodo_pago VARCHAR(40) NOT NULL DEFAULT 'PayPal',
  estado ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  paypal_order_id VARCHAR(100),
  email_enviado TINYINT(1) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS detalle_factura (
  id INT AUTO_INCREMENT PRIMARY KEY,
  factura_id INT NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0,
  importe DECIMAL(10, 2) NOT NULL DEFAULT 0,
  FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE
);

INSERT INTO usuarios (nombre, email, password, telefono, dui, rol)
SELECT 'Alexy Sanchez', 'demo@bahn.com', '$2a$10$pHG0xtCOWuF1.FCXLIxileDh5XyQ7tFwHQMy02TH8McEMEN.UI3uq', '0000-0000', '00000000-0', 'arrendador'
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE email = 'demo@bahn.com'
);

INSERT INTO vehiculos (
  titulo,
  categoria,
  marca,
  modelo,
  anio,
  km,
  condicion,
  color,
  tarifa,
  descripcion,
  direccion,
  direccion_completa,
  placa,
  titular,
  peso,
  fotos,
  owner_id
)
SELECT
  'Yamaha-R7 2025',
  'Motocicletas',
  'Yamaha',
  'R7',
  2023,
  8000,
  'Excelente',
  'Negro',
  25,
  'Yamaha R7 en perfectas condiciones, corre lona y lista para usar, todos los mantenimientos al dia, no te dejara botado.',
  'San Miguel, San Miguel',
  'Col. La Pradera, San Miguel Centro, San Miguel, El Salvador',
  'P 859 623',
  'Alexy Ariel Sanchez Suriano',
  'Liviano',
  '["/img/yamaha-1.jpg","/img/yamaha-2.jpg","/img/yamaha-3.jpg"]',
  u.id
FROM usuarios u
WHERE u.email = 'demo@bahn.com'
  AND NOT EXISTS (
    SELECT 1 FROM vehiculos WHERE titulo = 'Yamaha-R7 2025'
  );

UPDATE usuarios
SET dui = '00000000-0'
WHERE email = 'demo@bahn.com' AND (dui IS NULL OR dui = '');
