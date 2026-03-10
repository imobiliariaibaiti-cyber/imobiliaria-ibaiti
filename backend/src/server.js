import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { adminAuthMiddleware, clientAuthMiddleware } from "./middleware/auth.js";

dotenv.config();
const BUILD_MARKER = "backend-build-2026-03-02-01";

const serializeProperty = (property) => {
  if (!property) return property;
  return {
    ...property,
    price: typeof property.price === "bigint" ? Number(property.price) : property.price
  };
};

const serializeClientProperty = (property) => {
  if (!property) return property;
  return {
    ...property,
    priceExpectation: typeof property.priceExpectation === "bigint" ? Number(property.priceExpectation) : property.priceExpectation
  };
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

const app = express();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors());
app.use(express.json({ limit: "4mb" }));

const parseImages = (images) => {
  if (Array.isArray(images)) return images;
  return [];
};

const parseNumberLikeUserInput = (rawValue) => {
  const value = String(rawValue || "").trim().toLowerCase();
  if (!value) return NaN;

  const cleaned = value.replace(/r\$\s?/g, "").replace(/\s+/g, "");
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (hasComma && hasDot) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? /\./g : /,/g;
    const normalized = cleaned.replace(thousandsSeparator, "").replace(decimalSeparator, ".");
    return Number(normalized);
  }

  if (hasComma || hasDot) {
    const separator = hasComma ? "," : ".";
    const parts = cleaned.split(separator);
    const hasThousands = parts.length > 2 || (parts.length === 2 && parts[1].length === 3);
    const normalized = hasThousands ? parts.join("") : cleaned.replace(separator, ".");
    return Number(normalized);
  }

  return Number(cleaned);
};

const parsePrice = (value) => {
  const source = String(value || "").trim().toLowerCase();
  if (!source) return null;

  const isMillion = /\bmi\b|milh(?:ao|oes|ão|ões)/.test(source);
  const isThousand = !isMillion && /\bmil\b/.test(source);
  const multiplier = isMillion ? 1_000_000 : isThousand ? 1_000 : 1;

  const numericPart = source.replace(/\bmi\b|\bmil\b|milh(?:ao|oes|ão|ões)/g, "").trim();
  const baseValue = parseNumberLikeUserInput(numericPart);
  if (!Number.isFinite(baseValue) || baseValue <= 0) return null;

  return Math.round(baseValue * multiplier);
};

const signAdminToken = (email) => jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "12h" });
const signClientToken = (client) =>
  jwt.sign({ role: "client", clientUserId: client.id, email: client.email, name: client.name }, process.env.JWT_SECRET, { expiresIn: "30d" });

const uploadImagesToCloudinary = async (files, folder = "imobiliaria-ibaiti") => {
  if (!files?.length) {
    throw new Error("Nenhuma imagem enviada.");
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary nao configurado.");
  }

  return Promise.all(
    files.map(async (file) => {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri, { folder });
      if (!result?.secure_url) {
        throw new Error("Cloudinary retornou sem URL da imagem.");
      }
      return result.secure_url;
    })
  );
};

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Public: registrar visita/pageview (sem PII)
app.post(
  "/analytics/visit",
  asyncHandler(async (req, res) => {
    const { path, propertyId, source } = req.body || {};
    const safePath = String(path || "").slice(0, 200);
    const referrer = String(req.headers.referer || req.headers.referrer || "").slice(0, 200) || null;
    const userAgent = String(req.headers["user-agent"] || "").slice(0, 200) || null;

    if (!safePath) {
      return res.status(400).json({ message: "path obrigatorio." });
    }

    await prisma.visit.create({
      data: {
        path: safePath,
        propertyId: propertyId ? Number(propertyId) : null,
        source: source ? String(source).slice(0, 80) : null,
        referrer,
        userAgent
      }
    });

    res.status(201).json({ ok: true });
  })
);

app.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    const isValid = adminHash
      ? await bcrypt.compare(password || "", adminHash)
      : password === process.env.ADMIN_PASSWORD;

    if (!isValid) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    const token = signAdminToken(email);
    res.json({ token });
  })
);

app.post(
  "/client/auth/register",
  asyncHandler(async (req, res) => {
    const { name, email, phone, password, hasAccount } = req.body || {};

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Nome, email, telefone e senha sao obrigatorios." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await prisma.clientUser.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ message: "Ja existe uma conta com esse email." });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const clientUser = await prisma.clientUser.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        phone: String(phone).trim(),
        passwordHash,
        hasAccount: Boolean(hasAccount)
      }
    });

    const token = signClientToken(clientUser);
    res.status(201).json({
      token,
      user: {
        id: clientUser.id,
        name: clientUser.name,
        email: clientUser.email,
        phone: clientUser.phone,
        hasAccount: clientUser.hasAccount
      }
    });
  })
);

app.post(
  "/client/auth/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha sao obrigatorios." });
    }

    const clientUser = await prisma.clientUser.findUnique({
      where: { email: String(email).trim().toLowerCase() }
    });

    if (!clientUser) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    const isValid = await bcrypt.compare(String(password), clientUser.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Credenciais invalidas." });
    }

    const token = signClientToken(clientUser);
    res.json({
      token,
      user: {
        id: clientUser.id,
        name: clientUser.name,
        email: clientUser.email,
        phone: clientUser.phone,
        hasAccount: clientUser.hasAccount
      }
    });
  })
);

app.get(
  "/client/me",
  clientAuthMiddleware,
  asyncHandler(async (req, res) => {
    const clientUser = await prisma.clientUser.findUnique({
      where: { id: Number(req.auth.clientUserId) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        hasAccount: true,
        createdAt: true
      }
    });

    if (!clientUser) {
      return res.status(404).json({ message: "Cliente nao encontrado." });
    }

    res.json(clientUser);
  })
);

app.get(
  "/properties",
  asyncHandler(async (req, res) => {
    const { type, city, minPrice, maxPrice, featured } = req.query;

    try {
      const where = {
        ...(type ? { type: { equals: String(type), mode: "insensitive" } } : {}),
        ...(city ? { city: { equals: String(city), mode: "insensitive" } } : {}),
        ...(featured ? { featured: featured === "true" } : {}),
        ...(minPrice || maxPrice
          ? {
              price: {
                ...(minPrice ? { gte: Number(minPrice) } : {}),
                ...(maxPrice ? { lte: Number(maxPrice) } : {})
              }
            }
          : {})
      };

      const properties = await prisma.property.findMany({
        where,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
      });

      return res.json(properties.map(serializeProperty));
    } catch (error) {
      if (error.code === "P2021") {
        return res.json([]);
      }
      throw error;
    }
  })
);

app.get(
  "/properties/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID invalido." });
    }

    const property = await prisma.property.findUnique({
      where: { id }
    });

    if (!property) {
      return res.status(404).json({ message: "Imovel nao encontrado." });
    }

    res.json(serializeProperty(property));
  })
);

// Travel times from property to predefined destinations
app.get(
  "/properties/:id/travel-times",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID invalido." });
    }

    const property = await prisma.property.findUnique({ where: { id } });

    if (!property) {
      return res.status(404).json({ message: "Imovel nao encontrado." });
    }

    const { latitude, longitude } = property;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!latitude || !longitude || !apiKey) {
      return res.json([]);
    }

    let destinations;
    try {
      destinations = JSON.parse(process.env.TRAVEL_DESTINATIONS || "[]");
    } catch {
      destinations = [];
    }

    if (!Array.isArray(destinations) || destinations.length === 0) {
      destinations = [{ label: "Ibaiti", lat: -23.847, lng: -50.193 }];
    }

    const origins = `${latitude},${longitude}`;
    const destCoords = destinations.map((d) => `${d.lat},${d.lng}`).join("|");
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destCoords}&mode=driving&units=metric&key=${apiKey}`;

    const { data } = await axios.get(url);
    const elements = data?.rows?.[0]?.elements || [];

    const response = elements
      .map((el, idx) => ({
        label: destinations[idx]?.label || `Destino ${idx + 1}`,
        minutes: el?.duration ? Math.round(el.duration.value / 60) : null,
        distanceKm: el?.distance ? Number(el.distance.value / 1000).toFixed(1) : null
      }))
      .filter((item) => item.minutes !== null);

    res.json(response);
  })
);

// City summary cached
app.get(
  "/cities/summary",
  asyncHandler(async (req, res) => {
    const city = String(req.query.city || "").trim();
    if (!city) {
      return res.status(400).json({ message: "Cidade obrigatoria." });
    }

    const cached = await prisma.citySummary.findUnique({ where: { city: city.toLowerCase() } });
    const thirtyDays = 1000 * 60 * 60 * 24 * 30;
    if (cached && Date.now() - cached.fetchedAt.getTime() < thirtyDays) {
      return res.json(cached);
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.json(cached || {});
    }

    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&type=locality&language=pt-BR&key=${apiKey}`;
    const search = await axios.get(searchUrl);
    const placeId = search.data?.results?.[0]?.place_id;

    if (!placeId) {
      return res.json(cached || {});
    }

    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=pt-BR&fields=name,geometry,editorial_summary,rating,user_ratings_total&key=${apiKey}`;
    const detail = await axios.get(detailUrl);
    const info = detail.data?.result || {};

    const saved = await prisma.citySummary.upsert({
      where: { city: city.toLowerCase() },
      update: {
        summary: info.editorial_summary?.overview || cached?.summary || null,
        rating: info.rating || null,
        lat: info.geometry?.location?.lat || null,
        lng: info.geometry?.location?.lng || null,
        fetchedAt: new Date()
      },
      create: {
        city: city.toLowerCase(),
        summary: info.editorial_summary?.overview || null,
        rating: info.rating || null,
        lat: info.geometry?.location?.lat || null,
        lng: info.geometry?.location?.lng || null
      }
    });

    res.json(saved);
  })
);

// Public approved comments
app.get(
  "/properties/:id/comments",
  asyncHandler(async (req, res) => {
    const comments = await prisma.comment.findMany({
      where: { propertyId: Number(req.params.id), status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 20
    });
    res.json(comments);
  })
);

// Submit comment (pending moderation)
app.post(
  "/properties/:id/comments",
  asyncHandler(async (req, res) => {
    const { name, contact, rating, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({ message: "Nome e comentario obrigatorios." });
    }

    const safeRating = Math.min(5, Math.max(1, Number(rating || 5)));

    await prisma.comment.create({
      data: {
        propertyId: Number(req.params.id),
        name: name.trim(),
        contact: contact?.trim() || null,
        rating: safeRating,
        text: text.trim(),
        status: "PENDING"
      }
    });

    res.status(201).json({ message: "Comentario enviado para aprovacao." });
  })
);

app.get(
  "/client/properties",
  clientAuthMiddleware,
  asyncHandler(async (req, res) => {
    const properties = await prisma.clientProperty.findMany({
      where: { clientUserId: Number(req.auth.clientUserId) },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    res.json(properties.map(serializeClientProperty));
  })
);

app.post(
  "/client/properties",
  clientAuthMiddleware,
  asyncHandler(async (req, res) => {
    const {
      title,
      type,
      city,
      address,
      latitude,
      longitude,
      areaSize,
      priceExpectation,
      description,
      documentStatus,
      deedAndRegistryOk,
      images,
      videoUrl,
      notes,
      status
    } = req.body || {};

    if (!title || !type || !city || !description || !documentStatus) {
      return res.status(400).json({ message: "Titulo, tipo, cidade, descricao e status documental sao obrigatorios." });
    }

    const property = await prisma.clientProperty.create({
      data: {
        clientUserId: Number(req.auth.clientUserId),
        title: String(title).trim(),
        type: String(type).trim(),
        city: String(city).trim(),
        address: address ? String(address).trim() : null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        areaSize: areaSize ? String(areaSize).trim() : null,
        priceExpectation: parsePrice(priceExpectation) ? BigInt(parsePrice(priceExpectation)) : null,
        description: String(description).trim(),
        documentStatus: String(documentStatus).trim(),
        deedAndRegistryOk: Boolean(deedAndRegistryOk),
        images: parseImages(images),
        videoUrl: videoUrl ? String(videoUrl).trim() : null,
        notes: notes ? String(notes).trim() : null,
        status: status === "DRAFT" ? "DRAFT" : "PENDING_REVIEW"
      }
    });

    res.status(201).json(serializeClientProperty(property));
  })
);

app.put(
  "/client/properties/:id",
  clientAuthMiddleware,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID invalido." });
    }

    const existing = await prisma.clientProperty.findFirst({
      where: { id, clientUserId: Number(req.auth.clientUserId) }
    });

    if (!existing) {
      return res.status(404).json({ message: "Imovel do cliente nao encontrado." });
    }

    const {
      title,
      type,
      city,
      address,
      latitude,
      longitude,
      areaSize,
      priceExpectation,
      description,
      documentStatus,
      deedAndRegistryOk,
      images,
      videoUrl,
      notes,
      status
    } = req.body || {};

    const nextStatus = existing.status === "APPROVED" || existing.status === "REJECTED" ? existing.status : status === "DRAFT" ? "DRAFT" : "PENDING_REVIEW";

    const property = await prisma.clientProperty.update({
      where: { id },
      data: {
        title: title ? String(title).trim() : existing.title,
        type: type ? String(type).trim() : existing.type,
        city: city ? String(city).trim() : existing.city,
        address: address !== undefined ? (address ? String(address).trim() : null) : existing.address,
        latitude: latitude !== undefined ? (latitude ? Number(latitude) : null) : existing.latitude,
        longitude: longitude !== undefined ? (longitude ? Number(longitude) : null) : existing.longitude,
        areaSize: areaSize !== undefined ? (areaSize ? String(areaSize).trim() : null) : existing.areaSize,
        priceExpectation: priceExpectation !== undefined ? (parsePrice(priceExpectation) ? BigInt(parsePrice(priceExpectation)) : null) : existing.priceExpectation,
        description: description ? String(description).trim() : existing.description,
        documentStatus: documentStatus ? String(documentStatus).trim() : existing.documentStatus,
        deedAndRegistryOk: deedAndRegistryOk !== undefined ? Boolean(deedAndRegistryOk) : existing.deedAndRegistryOk,
        images: images !== undefined ? parseImages(images) : existing.images,
        videoUrl: videoUrl !== undefined ? (videoUrl ? String(videoUrl).trim() : null) : existing.videoUrl,
        notes: notes !== undefined ? (notes ? String(notes).trim() : null) : existing.notes,
        status: nextStatus
      }
    });

    res.json(serializeClientProperty(property));
  })
);

app.post(
  "/client/upload",
  clientAuthMiddleware,
  upload.array("images", 10),
  asyncHandler(async (req, res) => {
    const urls = await uploadImagesToCloudinary(req.files, "imobiliaria-ibaiti/clientes");
    res.status(201).json({ urls });
  })
);

// Approve comment (admin)
app.put(
  "/admin/comments/:id/approve",
  adminAuthMiddleware,
  asyncHandler(async (req, res) => {
    const comment = await prisma.comment.update({
      where: { id: Number(req.params.id) },
      data: { status: "APPROVED" }
    });

    res.json(comment);
  })
);

app.post(
  "/admin/properties",
  adminAuthMiddleware,
  asyncHandler(async (req, res) => {
    const {
      propertyCode,
      title,
      type,
      city,
      cityDescription,
      address,
      latitude,
      longitude,
      areaSize,
      price,
      description,
      deedAndRegistryOk,
      featured,
      images,
      videoUrl
    } = req.body;
    const parsedPrice = parsePrice(price);

    if (!parsedPrice) {
      return res.status(400).json({ message: "Preco invalido. Use: 580000, 580.000, 580 mil ou 1.2 mi." });
    }

    const property = await prisma.property.create({
      data: {
        propertyCode: propertyCode?.trim() || null,
        title,
        type,
        city,
        cityDescription: cityDescription?.trim() || null,
        address: address?.trim() || null,
        areaSize: areaSize?.trim() || null,
        price: BigInt(parsedPrice),
        description,
        deedAndRegistryOk: Boolean(deedAndRegistryOk),
        featured: Boolean(featured),
        images: parseImages(images),
        videoUrl: videoUrl?.trim() || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null
      }
    });

    res.status(201).json(serializeProperty(property));
  })
);

app.put(
  "/admin/properties/:id",
  adminAuthMiddleware,
  asyncHandler(async (req, res) => {
    const {
      propertyCode,
      title,
      type,
      city,
      cityDescription,
      address,
      latitude,
      longitude,
      areaSize,
      price,
      description,
      deedAndRegistryOk,
      featured,
      images,
      videoUrl
    } = req.body;
    const parsedPrice = parsePrice(price);

    if (!parsedPrice) {
      return res.status(400).json({ message: "Preco invalido. Use: 580000, 580.000, 580 mil ou 1.2 mi." });
    }

    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID invalido." });
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        propertyCode: propertyCode?.trim() || null,
        title,
        type,
        city,
        cityDescription: cityDescription?.trim() || null,
        address: address?.trim() || null,
        areaSize: areaSize?.trim() || null,
        price: BigInt(parsedPrice),
        description,
        deedAndRegistryOk: Boolean(deedAndRegistryOk),
        featured: Boolean(featured),
        images: parseImages(images),
        videoUrl: videoUrl?.trim() || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null
      }
    });

    res.json(serializeProperty(property));
  })
);

app.delete(
  "/admin/properties/:id",
  adminAuthMiddleware,
  asyncHandler(async (req, res) => {
    await prisma.property.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  })
);

// Admin dashboard: agregados simples de visitas
app.get(
  "/admin/analytics/summary",
  adminAuthMiddleware,
  asyncHandler(async (req, res) => {
    const days = Number(req.query.days || 30);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const total = await prisma.visit.count({ where: { createdAt: { gte: since } } });

    const propertyViewsRaw = await prisma.visit.groupBy({
      by: ["propertyId"],
      where: { createdAt: { gte: since }, NOT: { propertyId: null } },
      _count: { _all: true },
      orderBy: { _count: { _all: "desc" } },
      take: 10
    });

    const propertyIds = propertyViewsRaw.map((item) => item.propertyId).filter(Boolean);
    const propertyLookup = propertyIds.length
      ? await prisma.property.findMany({
          where: { id: { in: propertyIds } },
          select: { id: true, title: true, city: true }
        })
      : [];

    const propertyViews = propertyViewsRaw.map((item) => {
      const meta = propertyLookup.find((p) => p.id === item.propertyId);
      return {
        propertyId: item.propertyId,
        title: meta?.title || "Imovel removido",
        city: meta?.city || null,
        views: item._count._all
      };
    });

    const pages = await prisma.visit.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { _all: "desc" } },
      take: 10
    });

    const daily = await prisma.$queryRaw`
      SELECT date_trunc('day', "createdAt")::date AS day, COUNT(*)::int AS visits
      FROM "Visit"
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day DESC
      LIMIT 60;
    `;

    res.json({
      totalVisits: total,
      propertyViews,
      topPages: pages.map((p) => ({ path: p.path, views: p._count._all })),
      daily: daily.map((row) => ({ day: row.day, visits: Number(row.visits) }))
    });
  })
);

app.post(
  "/upload",
  adminAuthMiddleware,
  upload.array("images", 10),
  asyncHandler(async (req, res) => {
    const urls = await uploadImagesToCloudinary(req.files, "imobiliaria-ibaiti");
    res.status(201).json({ urls });
  })
);

app.use((err, _req, res, _next) => {
  console.error("Unhandled API error:", err);

  if (err?.code === "P2025") {
    return res.status(404).json({ message: "Imovel nao encontrado." });
  }

  if (err?.code === "P2021" || err?.code === "P2022") {
    return res.status(500).json({ message: "Banco de dados desatualizado. Execute Prisma db push no backend." });
  }

  res.status(500).json({ message: "Erro interno do servidor." });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`${BUILD_MARKER} | API executando na porta ${PORT}`);
});
