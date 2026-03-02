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

const app = express();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  const isValid = adminHash
    ? await bcrypt.compare(password || "", adminHash)
    : password === process.env.ADMIN_PASSWORD;

  if (!isValid) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

app.get("/properties", async (req, res) => {
  try {
    const { type, city, minPrice, maxPrice, featured } = req.query;

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

    res.json(properties);
  } catch (error) {
    // Keeps frontend available while DB migration is pending.
    if (error.code === "P2021") {
      return res.json([]);
    }
    throw error;
  }
});

app.get("/properties/:id", async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: Number(req.params.id) }
  });

  if (!property) {
    return res.status(404).json({ message: "Imóvel não encontrado." });
  }

  res.json(property);
});

app.post("/admin/properties", authMiddleware, async (req, res) => {
  const { title, type, city, price, description, featured, images } = req.body;

  const property = await prisma.property.create({
    data: {
      title,
      type,
      city,
      price: Number(price),
      description,
      featured: Boolean(featured),
      images: parseImages(images)
    }
  });

  res.status(201).json(property);
});

app.put("/admin/properties/:id", authMiddleware, async (req, res) => {
  const { title, type, city, price, description, featured, images } = req.body;

  const property = await prisma.property.update({
    where: { id: Number(req.params.id) },
    data: {
      title,
      type,
      city,
      price: Number(price),
      description,
      featured: Boolean(featured),
      images: parseImages(images)
    }
  });

  res.json(property);
});

app.delete("/admin/properties/:id", authMiddleware, async (req, res) => {
  await prisma.property.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

app.post("/upload", authMiddleware, upload.array("images", 10), async (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ message: "Nenhuma imagem enviada." });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(400).json({ message: "Cloudinary não configurado." });
  }

  const uploads = await Promise.all(
    req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "imobiliaria-ibaiti" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
    )
  );

  res.status(201).json({ urls: uploads });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor." });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`API executando na porta ${PORT}`);
});

