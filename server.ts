/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { SAMPLE_PROPERTIES } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for properties
let properties = [...SAMPLE_PROPERTIES];

// In-Memory Database for bookings
let bookings = [
  {
    id: "res-trancoso-001",
    propertyId: "prop-1",
    propertyTitle: "Villa Quadrado Trancoso & Alma Baiana",
    propertyImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=850&q=80",
    propertyLocation: "Quadrado, Trancoso, BA",
    checkIn: "2026-06-12",
    checkOut: "2026-06-14",
    guestsCount: 2,
    totalPrice: 2500,
    bookedAt: "2026-06-06T15:00:00Z",
    guestName: "Adalberto Café",
    guestEmail: "adalberto.cafe1982@gmail.com",
    status: "confirmado" as const
  }
];

// Lazy initialize Gemini client to prevent crashing if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST Endpoints
app.get("/api/properties", (req, res) => {
  res.json(properties);
});

app.post("/api/properties", (req, res) => {
  const {
    title,
    description,
    location,
    city,
    state,
    category,
    pricePerNight,
    maxGuests,
    bedrooms,
    bathrooms,
    hostName,
    hostAvatar,
    platformHighlight,
    amenities,
    checkInInstructions,
    images
  } = req.body;

  if (!title || !description || !location || !city || !state || !pricePerNight) {
    res.status(400).json({ error: "Campos obrigatórios ausentes" });
    return;
  }

  const newProperty = {
    id: `prop-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    title,
    description,
    location,
    city,
    state,
    category: category || "cabana",
    pricePerNight: Number(pricePerNight),
    rating: 5.0,
    reviewCount: 0,
    images: images && images.length > 0 ? images : [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    maxGuests: Number(maxGuests || 4),
    bedrooms: Number(bedrooms || 2),
    bathrooms: Number(bathrooms || 2),
    hostName: hostName || "Viajante Vip",
    hostAvatar: hostAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    platformHighlight: platformHighlight || {
      source: "Brisa Nordeste",
      benefit: "Selo de Lançamento",
      description: "Imóvel recentemente listado e auditado pelos nossos especialistas em luxo."
    },
    amenities: amenities || [
      { name: "Piscina Privada", category: "premium", icon: "Waves" },
      { name: "Wi-Fi Fibra", category: "básica", icon: "Wifi" },
      { name: "Ar Condicionado", category: "básica", icon: "Wind" }
    ],
    reviews: [],
    checkInInstructions: checkInInstructions || "Acesso biométrico liberado via senha digital enviada após confirmação."
  };

  properties.unshift(newProperty);
  res.status(201).json(newProperty);
});

app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/api/bookings", (req, res) => {
  const {
    propertyId,
    propertyTitle,
    propertyImage,
    propertyLocation,
    checkIn,
    checkOut,
    guestsCount,
    totalPrice,
    guestName,
    guestEmail
  } = req.body;

  if (!propertyId || !checkIn || !checkOut || !guestName || !guestEmail) {
    res.status(400).json({ error: "Campos obrigatórios ausentes" });
    return;
  }

  const newBooking = {
    id: `res-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    propertyId,
    propertyTitle,
    propertyImage,
    propertyLocation,
    checkIn,
    checkOut,
    guestsCount: Number(guestsCount),
    totalPrice: Number(totalPrice),
    bookedAt: new Date().toISOString(),
    guestName,
    guestEmail,
    status: "confirmado" as const
  };

  bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

// Concierge Virtual chat routing
app.post("/api/concierge", async (req, res) => {
  const { propertyInfo, chatHistory, userMessage, guestName } = req.body;

  try {
    const ai = getGeminiClient();

    // Context preparation
    const contextText = propertyInfo 
      ? `Você está atendendo o hóspede ${guestName || "Adalberto Café"} para o imóvel: "${propertyInfo.title}" localizado em "${propertyInfo.location}".
         Características principais:
         - Preço por noite: R$ ${propertyInfo.pricePerNight}
         - Limite de hóspedes: ${propertyInfo.maxGuests} pessoa(s)
         - Quartos: ${propertyInfo.bedrooms}, Banheiros: ${propertyInfo.bathrooms}
         - Anfitrião(ã): ${propertyInfo.hostName}
         - Destaque Premium: ${propertyInfo.platformHighlight.source} (${propertyInfo.platformHighlight.benefit}) - ${propertyInfo.platformHighlight.description}
         - Instruções de Check-In: "${propertyInfo.checkInInstructions}"
         - Comodidades disponíveis: ${propertyInfo.amenities.map((a: any) => `${a.name} (${a.category})`).join(", ")}`
      : "Você está ajudando o usuário a explorar os melhores imóveis de temporada na plataforma Brisa Nordeste.";

    const systemInstruction = `Você é o Mordomo e Concierge Virtual 24 horas da Brisa Nordeste, uma plataforma ultra-exclusiva de aluguéis de temporada no Nordeste do Brasil que reúne as maiores excelências de cada aplicativo do mercado (o design refinado do Airbnb, a fidedignidade do Plum Guide, as garantias do Booking.com e a facilidade familiar do Vrbo).
    
    Seu objetivo é encantar o hóspede com um serviço impecável, extremamente educado, prestativo, fluente e elegante em Português. Você deve sanar qualquer dúvida referente à estadia, check-in, funcionamento de comodidades (jacuzzi, aquecedores, lareiras) ou dar dicas de atividades locais na região.

    No seu tom de voz:
    - Seja cortês, chame o hóspede pelo nome quando disponível (e.g. ${guestName || "Adalberto"}).
    - Responda de forma assertiva e charmosa, sem lero-lero robótico. Prefira formatações limpas usando tópicos.
    - Dê dicas de restaurante adicionais ou de lazer baseados estritamente na localização do imóvel.
    - Caso perguntem de check-in, recomende seguir as instruções precisas configuradas para o imóvel.
    
    Contexto do imóvel atual:
    ${contextText}
    
    Importante: Mantenha as respostas focadas e evite saídas excessivamente longas.`;

    // Map chatHistory from [{sender, text}] to GoogleGenAI formats if needed, or construct simple instructions.
    const messagesToSend = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        messagesToSend.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }
    // Append current user message
    messagesToSend.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: messagesToSend,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Erro no concierge API:", error);
    if (error.message === "GEMINI_API_KEY_MISSING") {
      res.json({
        text: "Olá! Eu sou o seu Concierge 24 horas da Brisa Nordeste. Para que eu possa te dar sugestões personalizadas usando Inteligência Artificial avançada, você precisa cadastrar sua chave **GEMINI_API_KEY** no menu **Settings > Secrets**🔑 do AI Studio.\n\nEnquanto isso, posso lhe ajudar informando que as reservas na plataforma já estão totalmente operacionais de forma instantânea! Sinta-se à vontade para fazer uma simulação de aluguel."
      });
    } else {
      res.status(500).json({ error: "Erro interno do servidor de inteligência artificial" });
    }
  }
});

// Server integration with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
