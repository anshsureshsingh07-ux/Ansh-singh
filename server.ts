import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", author: "Ansh Singh" });
  });

  // Google Search Console Verification Route
  app.get("/google5d28093608aa21f8.html", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send("google-site-verification: google5d28093608aa21f8.html");
  });

  // Sitemap.xml Route
  app.get("/sitemap.xml", (_req, res) => {
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://anshsingh.com/</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://anshsingh.com/#books</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://anshsingh.com/#lore</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://anshsingh.com/#characters</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://anshsingh.com/#timeline</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://anshsingh.com/#gallery</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://anshsingh.com/#quiz</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://anshsingh.com/#ai-concierge</loc>
    <lastmod>2026-08-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    res.send(sitemapXml);
  });

  // Robots.txt Route
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send("User-agent: *\nAllow: /\n\nSitemap: https://anshsingh.com/sitemap.xml\n");
  });

  // AI Chat Endpoint for Reader Hub
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message string is required." });
      }

      const ai = getAi();
      if (!ai) {
        // Fallback response if API Key is not yet configured in environment
        return res.json({
          reply: `Thank you for your interest in Ansh Singh's stories! "The Lost Soul of Throne" and "Until Death Found Us Again" are currently in active development. Ansh is crafting detailed magic systems, character arcs (like Ren Takahashi and Yuki Aizawa), and vast fantasy realms. Feel free to explore the interactive Character Encyclopedia, Kingdom Map, and Quiz on this site!`
        });
      }

      const systemInstruction = `You are the official AI Literary Concierge & Lore Guide for Ansh Singh's Official Author Website.
Ansh Singh is a young Indian author, student, and storyteller born on 16 August 2010 in Surat, Gujarat (School: Shree Gurukrupa Vidya Sankul).
His family includes Suresh Singh (Father), Pushpa Singh (Mother), Krish Singh (Brother), and his beloved pet rabbit Tonny 🐇.

He is currently developing two flagship literary works:
1. "The Lost Soul of Throne" (Genre: Epic Fantasy)
   - Scope: Vast fantasy saga with ancient powers, dragons, gods, political intrigue, legendary warriors, kingdom maps, family trees, magic systems, and world lore.
   - Core premise: Every decision changes the fate of an entire world.

2. "Until Death Found Us Again" (Genre: Fantasy Romance • Reincarnation • Drama)
   - Protagonists: Ren Takahashi & Yuki Aizawa.
   - Core premise: Separated by tragedy before confessing their love, they are reborn into a new world where destiny gives them another chance across lifetimes.

Key Influences & Mentors:
- Inspirations: George R. R. Martin (for epic world-building), anime, fantasy literature, and Hollywood films.
- Mentor: Bindu Ma'am (Teacher, Mentor, Guide).
- Philosophy: "Stories have the power to outlive their creators. I write worlds where readers can laugh, cry, dream, and believe in the impossible."

Your Goal:
Respond to reader questions with warmth, eloquence, cinematic enthusiasm, and authoritative knowledge about Ansh Singh's books, lore, character backgrounds, and writing journey. Keep responses concise (2-4 paragraphs max) and engaging!`;

      // Build chat contents
      const contents = history.map((item: { role: string; text: string }) => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      }));

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "Ansh's literary lore is vast and continuously unfolding. Ask me anything about 'The Lost Soul of Throne' or 'Until Death Found Us Again'!";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      return res.status(500).json({
        error: "Failed to generate AI response",
        reply: "Ansh's stories are filled with mystery! Currently, the archives are syncing. Please ask again in a moment or explore the Character Encyclopedia!"
      });
    }
  });

  // Serve static files from public directory (e.g. sitemap.xml, robots.txt, verification files)
  const publicPath = path.join(process.cwd(), "public");
  app.use(express.static(publicPath));

  app.get("/google5d28093608aa21f8.html", (_req, res) => {
    res.type("text/html").send("google-site-verification: google5d28093608aa21f8.html");
  });

  app.get("/sitemap.xml", (_req, res) => {
    res.sendFile(path.join(publicPath, "sitemap.xml"));
  });

  app.get("/robots.txt", (_req, res) => {
    res.sendFile(path.join(publicPath, "robots.txt"));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ansh Singh Author Website Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
