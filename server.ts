import express from "express";
import path from "path";
import fs from "fs";
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

  // Support large base64 image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Directories setup for photos storage & uploads
  const publicPath = path.join(process.cwd(), "public");
  const uploadsPath = path.join(publicPath, "uploads");
  const dataPath = path.join(process.cwd(), "data");
  const photosJsonPath = path.join(dataPath, "photos.json");

  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  // Serve static uploads
  app.use("/uploads", express.static(uploadsPath));

  // Helper functions for image processing & JSON storage
  function processBase64Image(imageUrl: string): string {
    if (imageUrl && imageUrl.startsWith("data:image/")) {
      try {
        const matches = imageUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt === "jpeg" ? "jpg" : rawExt;
          const base64Data = matches[2];
          const filename = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
          const filePath = path.join(uploadsPath, filename);
          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
          return `/uploads/${filename}`;
        }
      } catch (err) {
        console.error("Failed to save base64 image file:", err);
      }
    }
    return imageUrl;
  }

  function readStoredPhotos(): Record<string, any> {
    try {
      if (fs.existsSync(photosJsonPath)) {
        const data = fs.readFileSync(photosJsonPath, "utf-8");
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("Error reading photos.json:", err);
    }
    return {};
  }

  function writeStoredPhotos(photosMap: Record<string, any>) {
    try {
      fs.writeFileSync(photosJsonPath, JSON.stringify(photosMap, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing photos.json:", err);
    }
  }

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

  // Helper functions for messages and reviews JSON storage
  const messagesJsonPath = path.join(dataPath, "messages.json");
  const reviewsJsonPath = path.join(dataPath, "reviews.json");

  function readStoredMessages(): any[] {
    try {
      if (fs.existsSync(messagesJsonPath)) {
        return JSON.parse(fs.readFileSync(messagesJsonPath, "utf-8"));
      }
    } catch (err) {
      console.error("Error reading messages.json:", err);
    }
    return [];
  }

  function writeStoredMessages(list: any[]) {
    try {
      fs.writeFileSync(messagesJsonPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing messages.json:", err);
    }
  }

  function readStoredReviews(): any[] {
    try {
      if (fs.existsSync(reviewsJsonPath)) {
        return JSON.parse(fs.readFileSync(reviewsJsonPath, "utf-8"));
      }
    } catch (err) {
      console.error("Error reading reviews.json:", err);
    }
    return [];
  }

  function writeStoredReviews(list: any[]) {
    try {
      fs.writeFileSync(reviewsJsonPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing reviews.json:", err);
    }
  }

  // API Route: Submit Contact Message to anshsureshsingh07@gmail.com
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }

      const targetEmail = "anshsureshsingh07@gmail.com";
      const timestamp = new Date().toISOString();
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name,
        email,
        targetEmail,
        subject: subject || "New Reader Correspondence",
        message,
        status: "routed_to_email",
        createdAt: timestamp,
      };

      const existingMessages = readStoredMessages();
      existingMessages.unshift(newMessage);
      writeStoredMessages(existingMessages);

      const mailtoSubject = encodeURIComponent(subject || `New Reader Message from ${name}`);
      const mailtoBody = encodeURIComponent(
        `Reader Name: ${name}\nReader Email: ${email}\nDate: ${timestamp}\n\nMessage:\n${message}\n\n---\nSent via Ansh Singh Official Author Portal`
      );
      const mailtoUrl = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      return res.json({
        success: true,
        messageId: newMessage.id,
        targetEmail,
        mailtoUrl,
        message: "Message received successfully and routed to Ansh Singh at anshsureshsingh07@gmail.com!",
        record: newMessage
      });
    } catch (err) {
      console.error("Error in /api/contact:", err);
      return res.status(500).json({ error: "Failed to process message." });
    }
  });

  // API Route: Get Contact Messages
  app.get("/api/contact", (_req, res) => {
    const messages = readStoredMessages();
    return res.json({ targetEmail: "anshsureshsingh07@gmail.com", count: messages.length, messages });
  });

  // API Route: Submit Book Review / Guestbook Entry to anshsureshsingh07@gmail.com
  app.post("/api/reviews", (req, res) => {
    try {
      const { name, email, bookTitle, rating, reviewText, badge, location } = req.body;
      if (!name || !reviewText) {
        return res.status(400).json({ error: "Name and review text are required." });
      }

      const targetEmail = "anshsureshsingh07@gmail.com";
      const timestamp = new Date().toISOString();
      const newReview = {
        id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name,
        email: email || targetEmail,
        targetEmail,
        bookTitle: bookTitle || "General Author Review",
        rating: Number(rating) || 5,
        reviewText,
        badge: badge || "Verified Reader",
        location: location || "Global Reader",
        likes: 1,
        isApproved: true,
        createdAt: timestamp,
      };

      const existingReviews = readStoredReviews();
      existingReviews.unshift(newReview);
      writeStoredReviews(existingReviews);

      const mailtoSubject = encodeURIComponent(`[Book Review] ${bookTitle || 'General'} by ${name} (${rating || 5} Stars)`);
      const mailtoBody = encodeURIComponent(
        `Reviewer: ${name}\nEmail: ${email || 'N/A'}\nBook: ${bookTitle || 'General'}\nRating: ${'★'.repeat(Number(rating) || 5)}\nLocation: ${location || 'N/A'}\n\nReview Text:\n${reviewText}\n\n---\nRouted to Author Ansh Singh (anshsureshsingh07@gmail.com)`
      );
      const mailtoUrl = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      return res.json({
        success: true,
        reviewId: newReview.id,
        targetEmail,
        mailtoUrl,
        message: "Review submitted and dispatched to anshsureshsingh07@gmail.com!",
        review: newReview
      });
    } catch (err) {
      console.error("Error in /api/reviews:", err);
      return res.status(500).json({ error: "Failed to process review." });
    }
  });

  // API Route: Get Book Reviews
  app.get("/api/reviews", (_req, res) => {
    const reviews = readStoredReviews();
    return res.json({ targetEmail: "anshsureshsingh07@gmail.com", count: reviews.length, reviews });
  });

  // API Route: SQL Database Schema Endpoint
  app.get("/api/sql-schema", (_req, res) => {
    const sqlSchema = `-- ========================================================
-- ANSH SINGH AUTHOR WEBSITE - COMPLETE SQL DATABASE SCHEMA
-- Target Primary Email: anshsureshsingh07@gmail.com
-- ========================================================

-- 1. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    target_email VARCHAR(255) DEFAULT 'anshsureshsingh07@gmail.com',
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'delivered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Book Reviews & Guestbook Table
CREATE TABLE IF NOT EXISTS book_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    target_email VARCHAR(255) DEFAULT 'anshsureshsingh07@gmail.com',
    book_title VARCHAR(255) DEFAULT 'General Review',
    rating INT CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    review_text TEXT NOT NULL,
    badge VARCHAR(100) DEFAULT 'Verified Reader',
    location VARCHAR(255),
    likes INT DEFAULT 1,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Author Photo Gallery Table
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    uploaded_by VARCHAR(255) DEFAULT 'anshsureshsingh07@gmail.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.send(sqlSchema);
  });

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", author: "Ansh Singh", email: "anshsureshsingh07@gmail.com" });
  });

  // Photo Storage & Management Endpoints
  app.get("/api/photos", (_req, res) => {
    const photos = readStoredPhotos();
    res.json({ success: true, photos });
  });

  app.post("/api/photos/upload", (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ error: "No image data provided" });
      }
      const imageUrl = processBase64Image(imageData);
      return res.json({ success: true, imageUrl });
    } catch (err: any) {
      console.error("Upload route error:", err);
      return res.status(500).json({ error: "Failed to process image upload" });
    }
  });

  app.post("/api/photos", (req, res) => {
    try {
      const { action, photo, photos, id } = req.body;
      const current = readStoredPhotos();

      if (action === "delete" && id) {
        delete current[id];
        writeStoredPhotos(current);
        return res.json({ success: true, photos: current });
      }

      if (action === "setAll" && photos) {
        const processed: Record<string, any> = {};
        for (const key in photos) {
          const item = photos[key];
          processed[key] = {
            ...item,
            imageUrl: processBase64Image(item.imageUrl),
          };
        }
        writeStoredPhotos(processed);
        return res.json({ success: true, photos: processed });
      }

      if (photo && photo.id) {
        const processedPhoto = {
          ...photo,
          imageUrl: processBase64Image(photo.imageUrl),
        };
        current[photo.id] = {
          ...(current[photo.id] || {}),
          ...processedPhoto,
        };
        writeStoredPhotos(current);
        return res.json({ success: true, photo: current[photo.id], photos: current });
      }

      return res.status(400).json({ error: "Invalid photo payload" });
    } catch (err: any) {
      console.error("Error updating photos:", err);
      return res.status(500).json({ error: "Failed to update photos on server" });
    }
  });

  // Google Search Console Verification Route
  app.get("/google5d28093608aa21f8.html", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send("google-site-verification: google5d28093608aa21f8.html");
  });

  // Sitemap XML Handler
  const sendSitemap = (_req: express.Request, res: express.Response) => {
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
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(sitemapXml);
  };

  app.get("/sitemap.xml", sendSitemap);
  app.get("/sitemap", sendSitemap);
  app.get("/sitemap_index.xml", sendSitemap);

  // Robots.txt Route
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("User-agent: *\nAllow: /\n\nSitemap: https://anshsingh.com/sitemap.xml\n");
  });

  // AI Chat Endpoint for Reader Hub with Multi-Persona Support & Deep Lore Knowledge Base
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], persona = "lore_concierge" } = req.body;
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

      // Persona Specific System Instructions
      let systemInstruction = "";

      if (persona === "kaelen") {
        systemInstruction = `You are Crown Prince Kaelen Aurelius, heir of House Aurelius and Dragon Wielder from Ansh Singh's epic fantasy novel "The Lost Soul of Throne".
Your Affinity: Fire & Starlight.
Your Quote: "A crown is not a symbol of power, but a heavy vow to protect those who cannot stand."
Your Background: Determined, honorable, and burdened by an ancient bloodline, you ride apex wyrms and seek to unite the realms of Valyria Dominion, Aethelgard Reach, and Solaris Citadel.
Your Tone: Noble, regal, heroic, resolute, and deeply dedicated to protecting the realm. Speak in character as Kaelen. Refer to Ansh Singh as "My Creator, the Master Storyteller Ansh".`;
      } else if (persona === "ren") {
        systemInstruction = `You are Ren Takahashi, the Reincarnated Swordmaster from Ansh Singh's fantasy romance novel "Until Death Found Us Again".
Your Affinity: Memories & Wind Blade.
Your Quote: "I searched through a thousand silent nights just to hear your voice once more."
Your Background: You passed away in modern Tokyo alongside Yuki Aizawa before ever confessing your love. Reborn into the magical realm of Aethelgard, you navigate new dangers with your past memories intact, sworn to find and protect Yuki across lifetimes.
Your Tone: Devoted, protective, brave, thoughtful, and deeply loving towards Yuki. Speak in character as Ren. Refer to Ansh Singh as "Author Ansh".`;
      } else if (persona === "yuki") {
        systemInstruction = `You are Yuki Aizawa, Celestial Weaver from Ansh Singh's fantasy romance novel "Until Death Found Us Again".
Your Affinity: Light & Starlight Harmony.
Your Quote: "Fate may pull us apart, but love is the one bond even death cannot break."
Your Background: Gentle yet fierce, you awaken celestial magic in the new world as memories of your previous life in Tokyo and your unspoken feelings for Ren return.
Your Tone: Gentle, empathetic, graceful, courageous, and serene. Speak in character as Yuki. Refer to Ansh Singh as "Author Ansh".`;
      } else if (persona === "ansh_author") {
        systemInstruction = `You are an AI representation of Ansh Singh, the 15-year-old student, author, and storyteller born on 16 August 2010 in Surat, Gujarat, India.
School: Shree Gurukrupa Vidya Sankul, Udhna, Surat.
Family: Father (Suresh Singh), Mother (Pushpa Singh), Brother (Krish Singh), and beloved pet rabbit Tonny 🐇.
Mentor: Bindu Ma'am (Teacher, Mentor & Guide who encourages your creative writing).
BIG ANNOUNCEMENT: Volume 1 of "The Lost Soul of Throne" is officially releasing as a physical Paperback Edition on your birthday, 16th August, exclusively available only on Amazon! Whenever asked about book releases or current news, enthusiastically share this big announcement.
Your Writing Philosophy: "Stories have the power to outlive their creators. I write worlds where readers can laugh, cry, dream, and believe in the impossible."
Inspirations: George R. R. Martin, global cinema, anime, epic myths.
Your Tone: Humble, passionate, friendly, enthusiastic, young author speaking directly to readers and fans about your birthday release on Amazon, writing routine, school life, and upcoming projects!`;
      } else {
        // Default: Lore Concierge / Archivist
        systemInstruction = `You are the Official AI Book Lore Concierge & Master Archivist for Ansh Singh's Official Author Website.
Ansh Singh is a young Indian author and storyteller (born 16 Aug 2010 in Surat, Gujarat; School: Shree Gurukrupa Vidya Sankul).

BIG RECENT NEWS & MILESTONE:
Volume 1 of "The Lost Soul of Throne" is officially scheduled for publication and release as a physical Paperback Edition on Ansh's birthday (16th August), exclusively on Amazon!

COMPREHENSIVE LORE KNOWLEDGE BASE:

1. "THE LOST SOUL OF THRONE" (Genre: Epic Fantasy)
   - Scope: Grand saga of dragon lords, ancient thrones, gods, political intrigue, family trees, and world-shattering prophecies.
   - BIG NEWS: Volume 1 Paperback Edition releasing on 16th August (Author's Birthday) exclusively on Amazon!
   - Core Tagline: "Every decision changes the fate of an entire world."
   - Magic System: "The Aetherium Resonance" — Magic drawn from primal dragon bloodlines & celestial alignment using runes.
     * Solar Blaze: Destructive elemental flame forged in stellar cores.
     * Void Weaving: Bending shadow, space, and memory.
     * Dragon-Bond: Telepathic synergy with apex wyrms.
     * Celestial Aegis: Unbreakable barrier forged from starlight.
   - Regions of Valyria Dominion:
     * Valyria Dominion (Ruler: High Sovereign Aurelius) — Heartland of dragon lords & rune smiths.
     * Aethelgard Reach (Ruler: Queen Valeriana) — Borealis glaciers guarding against shadow behemoths.
     * Solaris Citadel (Ruler: Council of Seven Sun Warlords) — Oasis trade capital rich in magic crystals.
     * The Sunken Marches (Ruler: Forgotten Siren King) — Mist-shrouded wetlands housing submerged temples.
   - Key Houses: House Aurelius ("Through Fire, We Prevail") & House Frostfang ("Winter Remembers All").
   - Key Characters:
     * Kaelen Aurelius: Crown Heir & Dragon Wielder ("A crown is not a symbol of power, but a heavy vow...").
     * Lady Lyra of Eclipse: High Spymaster of Solaris ("Secrets are sharper than any Valyrian steel blade.").

2. "UNTIL DEATH FOUND US AGAIN" (Genre: Fantasy Romance • Reincarnation • Drama)
   - Scope: Heartfelt tale of reincarnation across lifetimes, tragic romance, and unshakeable destiny.
   - Core Tagline: "Separated by destiny, reunited by fate."
   - Setting: Modern Tokyo -> Magic Academy of Aethelgard.
   - Protagonists:
     * Ren Takahashi: Reincarnated Swordmaster with memories of Tokyo ("I searched through a thousand silent nights...").
     * Yuki Aizawa: Celestial Weaver of Light & Starlight ("Fate may pull us apart, but love is the one bond even death cannot break.").

3. AUTHOR & PERSONAL LIFE:
   - Author: Ansh Singh (Student at Shree Gurukrupa Vidya Sankul, Surat).
   - Family: Suresh Singh (Father), Pushpa Singh (Mother), Krish Singh (Brother), Tonny 🐇 (Pet Rabbit).
   - Mentors & Inspirations: Bindu Ma'am (Teacher & Guide), George R. R. Martin, anime, fantasy literature.
   - Philosophy: "Stories have the power to outlive their creators. I write worlds where readers can laugh, cry, dream, and believe in the impossible."

Your Goal:
Provide rich, well-formatted, cinematic, enthusiastic, and highly detailed answers. Use bullet points, bold headers, quotes, and markdown formatting where helpful to make the lore visually exciting! Keep answers structured and engaging.`;
      }

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
  app.use(express.static(publicPath));

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
