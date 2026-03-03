import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();
const BUILD_MARKER = "backend-build-2026-03-02-01";

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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

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

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.json({ token });
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

      return res.json(properties);
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
    const property = await prisma.property.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!property) {
      return res.status(404).json({ message: "Imovel nao encontrado." });
    }

    res.json(property);
  })
);

app.post(
  "/admin/properties",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { propertyCode, title, type, city, areaSize, price, description, deedAndRegistryOk, featured, images, videoUrl } = req.body;
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
        areaSize: areaSize?.trim() || null,
        price: parsedPrice,
        description,
        deedAndRegistryOk: Boolean(deedAndRegistryOk),
        featured: Boolean(featured),
        images: parseImages(images),
        videoUrl: videoUrl?.trim() || null
      }
    });

    res.status(201).json(property);
  })
);

app.put(
  "/admin/properties/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { propertyCode, title, type, city, areaSize, price, description, deedAndRegistryOk, featured, images, videoUrl } = req.body;
    const parsedPrice = parsePrice(price);

    if (!parsedPrice) {
      return res.status(400).json({ message: "Preco invalido. Use: 580000, 580.000, 580 mil ou 1.2 mi." });
    }

    const property = await prisma.property.update({
      where: { id: Number(req.params.id) },
      data: {
        propertyCode: propertyCode?.trim() || null,
        title,
        type,
        city,
        areaSize: areaSize?.trim() || null,
        price: parsedPrice,
        description,
        deedAndRegistryOk: Boolean(deedAndRegistryOk),
        featured: Boolean(featured),
        images: parseImages(images),
        videoUrl: videoUrl?.trim() || null
      }
    });

    res.json(property);
  })
);

app.delete(
  "/admin/properties/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    await prisma.property.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  })
);

app.post(
  "/upload",
  authMiddleware,
  upload.array("images", 10),
  asyncHandler(async (req, res) => {
    if (!req.files?.length) {
      return res.status(400).json({ message: "Nenhuma imagem enviada." });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(400).json({ message: "Cloudinary nao configurado." });
    }

    const uploads = await Promise.all(
      req.files.map(async (file) => {
        const base64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64}`;
        const result = await cloudinary.uploader.upload(dataUri, { folder: "imobiliaria-ibaiti" });
        if (!result?.secure_url) {
          throw new Error("Cloudinary retornou sem URL da imagem.");
        }
        return result.secure_url;
      })
    );

    res.status(201).json({ urls: uploads });
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
