export const formatPrice = (value) =>
  Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const resolveImage = (images) => {
  if (Array.isArray(images) && images.length > 0) return images[0];
  return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80";
};

export const getWhatsAppLink = (message) => {
  const number = process.env.NEXT_PUBLIC_WHATSAPP || "5543999999999";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return `https://www.youtube.com${parsed.pathname}`;
      }
    }
  } catch {
    return "";
  }

  return "";
};

