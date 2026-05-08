const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");

const pageRoutes = new Map([
  ["/", "index.html"],
  ["/auth", "auth.html"],
  ["/catalog", "catalog.html"],
  ["/detail", "detail.html"],
  ["/dashboard", "dashboard.html"],
  ["/wishlist", "wishlist.html"]
]);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

async function readJson(fileName) {
  const raw = await fs.readFile(path.join(DATA_DIR, fileName), "utf8");
  return JSON.parse(raw);
}

async function writeJson(fileName, payload) {
  const serialized = `${JSON.stringify(payload, null, 2)}\n`;
  await fs.writeFile(path.join(DATA_DIR, fileName), serialized, "utf8");
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(new Error("Invalid JSON payload"));
      }
    });
    req.on("error", reject);
  });
}

function toSlug(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function normalizeVehicle(payload, existingRecord = {}) {
  const title = String(payload.title || existingRecord.title || "").trim();
  const brand = String(payload.brand || existingRecord.brand || "").trim();
  const model = String(payload.model || existingRecord.model || "").trim();
  const category = String(payload.category || existingRecord.category || "Heavy Machinery").trim();
  const categoryKey = String(payload.categoryKey || existingRecord.categoryKey || "heavy").trim();
  const year = payload.year ? Number(payload.year) : existingRecord.year || "";
  const mileage = payload.mileage ? Number(payload.mileage) : existingRecord.mileage || 0;
  const price = payload.price ? Number(payload.price) : existingRecord.price || 0;

  return {
    ...existingRecord,
    id: existingRecord.id || buildId("veh"),
    slug: toSlug(title || `${brand} ${model}`),
    title,
    brand,
    model,
    category,
    categoryKey,
    year,
    mileage,
    price,
    titleEs: String(payload.titleEs || existingRecord.titleEs || title).trim(),
    titleEn: String(payload.titleEn || existingRecord.titleEn || title).trim(),
    priceUnit: String(payload.priceUnit || existingRecord.priceUnit || "day").trim(),
    location: String(payload.location || existingRecord.location || "").trim(),
    city: String(payload.city || existingRecord.city || payload.location || "").trim(),
    locationEs: String(payload.locationEs || existingRecord.locationEs || payload.location || existingRecord.location || "").trim(),
    locationEn: String(payload.locationEn || existingRecord.locationEn || payload.location || existingRecord.location || "").trim(),
    visualCondition: String(payload.visualCondition || existingRecord.visualCondition || "Good").trim(),
    mechanicalCondition: String(payload.mechanicalCondition || existingRecord.mechanicalCondition || "Good").trim(),
    description: String(payload.description || existingRecord.description || "").trim(),
    descriptionEs: String(payload.descriptionEs || existingRecord.descriptionEs || payload.description || existingRecord.description || "").trim(),
    descriptionEn: String(payload.descriptionEn || existingRecord.descriptionEn || payload.description || existingRecord.description || "").trim(),
    ownerId: String(payload.ownerId || existingRecord.ownerId || "").trim(),
    ownerName: String(payload.ownerName || existingRecord.ownerName || "").trim(),
    contactEmail: String(payload.contactEmail || existingRecord.contactEmail || "").trim(),
    contactPhone: String(payload.contactPhone || existingRecord.contactPhone || "").trim(),
    contactWhatsapp: String(payload.contactWhatsapp || existingRecord.contactWhatsapp || "").trim(),
    thumbnail: String(
      payload.thumbnail ||
        existingRecord.thumbnail ||
        "https://images.unsplash.com/photo-1751054619908-65d27a503ce8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1600"
    ).trim(),
    heroImage: String(
      payload.heroImage ||
        existingRecord.heroImage ||
        "https://images.unsplash.com/photo-1751054619908-65d27a503ce8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=2200"
    ).trim(),
    gallery: Array.isArray(payload.gallery) && payload.gallery.length ? payload.gallery : existingRecord.gallery || [],
    featured: typeof payload.featured === "boolean" ? payload.featured : Boolean(existingRecord.featured),
    active: typeof payload.active === "boolean" ? payload.active : existingRecord.active !== false,
    createdAt: existingRecord.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function filterVehicles(vehicles, searchParams) {
  const q = String(searchParams.get("q") || "").toLowerCase().trim();
  const category = String(searchParams.get("category") || "").toLowerCase().trim();
  const location = String(searchParams.get("location") || "").toLowerCase().trim();
  const condition = String(searchParams.get("condition") || "").toLowerCase().trim();
  const ownerId = String(searchParams.get("ownerId") || "").trim();
  const featuredOnly = searchParams.get("featured") === "true";
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 1000000);
  const sort = String(searchParams.get("sort") || "featured").trim();

  const filtered = vehicles.filter((vehicle) => {
    if (vehicle.active === false) {
      return false;
    }

    if (featuredOnly && !vehicle.featured) {
      return false;
    }

    if (ownerId && vehicle.ownerId !== ownerId) {
      return false;
    }

    if (category) {
      const candidate = `${vehicle.category} ${vehicle.categoryKey}`.toLowerCase();
      if (!candidate.includes(category)) {
        return false;
      }
    }

    if (location && !vehicle.location.toLowerCase().includes(location)) {
      return false;
    }

    if (condition) {
      const conditionBlob = `${vehicle.visualCondition} ${vehicle.mechanicalCondition}`.toLowerCase();
      if (!conditionBlob.includes(condition)) {
        return false;
      }
    }

    if (vehicle.price < minPrice || vehicle.price > maxPrice) {
      return false;
    }

    if (!q) {
      return true;
    }

    const haystack = [
      vehicle.title,
      vehicle.titleEs,
      vehicle.titleEn,
      vehicle.brand,
      vehicle.model,
      vehicle.category,
      vehicle.location,
      vehicle.locationEs,
      vehicle.locationEn,
      vehicle.description,
      vehicle.descriptionEs,
      vehicle.descriptionEn
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });

  filtered.sort((left, right) => {
    if (sort === "price-asc") {
      return left.price - right.price;
    }

    if (sort === "price-desc") {
      return right.price - left.price;
    }

    if (sort === "latest") {
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    }

    if (left.featured && !right.featured) {
      return -1;
    }

    if (!left.featured && right.featured) {
      return 1;
    }

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });

  return filtered;
}

async function handleApi(req, res, url) {
  const { pathname, searchParams } = url;

  if (pathname === "/api/config" && req.method === "GET") {
    sendJson(res, 200, {
      brand: "Bahn",
      title: "Bahn | Renta de vehiculos",
      demoUsers: [
        { email: "owner@bahn.com", password: "123456", role: "owner" },
        { email: "client@bahn.com", password: "123456", role: "client" }
      ]
    });
    return true;
  }

  if (pathname === "/api/categories" && req.method === "GET") {
    const vehicles = await readJson("vehicles.json");
    const categories = Array.from(
      new Map(
        vehicles.map((vehicle) => [
          vehicle.categoryKey,
          {
            key: vehicle.categoryKey,
            label: vehicle.category
          }
        ])
      ).values()
    );

    sendJson(res, 200, categories);
    return true;
  }

  if (pathname === "/api/login" && req.method === "POST") {
    const payload = await parseBody(req);
    const users = await readJson("users.json");

    const user = users.find(
      (entry) =>
        entry.email.toLowerCase() === String(payload.email || "").toLowerCase().trim() &&
        entry.password === String(payload.password || "")
    );

    if (!user) {
      sendError(res, 401, "Credenciales invalidas");
      return true;
    }

    sendJson(res, 200, {
      message: "Sesion iniciada",
      user: sanitizeUser(user)
    });
    return true;
  }

  if (pathname === "/api/register" && req.method === "POST") {
    const payload = await parseBody(req);
    const requiredFields = ["name", "email", "password", "phone", "role"];
    const missingField = requiredFields.find((field) => !String(payload[field] || "").trim());

    if (missingField) {
      sendError(res, 400, `Falta el campo ${missingField}`);
      return true;
    }

    const users = await readJson("users.json");
    const email = String(payload.email).toLowerCase().trim();

    if (users.some((entry) => entry.email.toLowerCase() === email)) {
      sendError(res, 409, "Este correo ya esta registrado");
      return true;
    }

    const newUser = {
      id: buildId("usr"),
      name: String(payload.name).trim(),
      email,
      password: String(payload.password),
      phone: String(payload.phone).trim(),
      role: payload.role === "owner" ? "owner" : "client",
      active: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeJson("users.json", users);

    sendJson(res, 201, {
      message: "Cuenta creada",
      user: sanitizeUser(newUser)
    });
    return true;
  }

  if (pathname === "/api/vehicles" && req.method === "GET") {
    const vehicles = await readJson("vehicles.json");
    sendJson(res, 200, filterVehicles(vehicles, searchParams));
    return true;
  }

  if (pathname === "/api/vehicles" && req.method === "POST") {
    const payload = await parseBody(req);
    const vehicles = await readJson("vehicles.json");

    const newVehicle = normalizeVehicle(payload);
    vehicles.unshift(newVehicle);
    await writeJson("vehicles.json", vehicles);

    sendJson(res, 201, newVehicle);
    return true;
  }

  if (pathname.startsWith("/api/vehicles/")) {
    const vehicleId = pathname.split("/").pop();
    const vehicles = await readJson("vehicles.json");
    const index = vehicles.findIndex((vehicle) => vehicle.id === vehicleId);

    if (index === -1) {
      sendError(res, 404, "Vehiculo no encontrado");
      return true;
    }

    if (req.method === "GET") {
      sendJson(res, 200, vehicles[index]);
      return true;
    }

    if (req.method === "PUT") {
      const payload = await parseBody(req);
      const updatedVehicle = normalizeVehicle(payload, vehicles[index]);
      vehicles[index] = updatedVehicle;
      await writeJson("vehicles.json", vehicles);
      sendJson(res, 200, updatedVehicle);
      return true;
    }

    if (req.method === "DELETE") {
      const [removedVehicle] = vehicles.splice(index, 1);
      await writeJson("vehicles.json", vehicles);
      sendJson(res, 200, {
        message: "Vehiculo eliminado",
        vehicle: removedVehicle
      });
      return true;
    }
  }

  if (pathname.startsWith("/api/owner-stats/") && req.method === "GET") {
    const ownerId = pathname.split("/").pop();
    const vehicles = await readJson("vehicles.json");
    const ownerVehicles = vehicles.filter((vehicle) => vehicle.ownerId === ownerId && vehicle.active !== false);
    const stats = {
      totalVehicles: ownerVehicles.length,
      activeListings: ownerVehicles.length,
      averagePrice: ownerVehicles.length
        ? Math.round(ownerVehicles.reduce((sum, vehicle) => sum + Number(vehicle.price), 0) / ownerVehicles.length)
        : 0,
      featuredListings: ownerVehicles.filter((vehicle) => vehicle.featured).length
    };

    sendJson(res, 200, stats);
    return true;
  }

  return false;
}

async function serveStatic(res, pathname) {
  const target = pageRoutes.get(pathname) || pathname.slice(1);
  const filePath = path.normalize(path.join(PUBLIC_DIR, target));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendError(res, 403, "Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      throw new Error("Directories are not served");
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";
    const content = await fs.readFile(filePath);

    res.writeHead(200, {
      "Content-Type": contentType
    });
    res.end(content);
  } catch (error) {
    sendError(res, 404, "Recurso no encontrado");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, url);
      if (!handled) {
        sendError(res, 404, "API route not found");
      }
      return;
    }

    await serveStatic(res, url.pathname);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Unexpected server error");
  }
});

server.listen(PORT, () => {
  console.log(`Bahn app running on http://localhost:${PORT}`);
});
