/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property } from "./types";

export const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Villa Quadrado Trancoso & Alma Baiana",
    description: "Sinta a magia baiana na sua essência neste refúgio rústico-chique a poucos passos do histórico Quadrado de Trancoso. Com design assinado por artesãos locais, oferece piscina privativa envolta por um jardim tropical exuberante, enxoval de linho puro, banheira externa esculpida em pedra sabão e serviço de concierge especializado.",
    location: "Quadrado, Trancoso, BA",
    city: "Trancoso",
    state: "BA",
    category: "cabana",
    pricePerNight: 1250,
    rating: 4.98,
    reviewCount: 142,
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
    ],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hostName: "Helena Salles",
    hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
    platformHighlight: {
      source: "Airbnb",
      benefit: "Selo de Design Excepcional",
      description: "Hospedagem avaliada no top 1% de design arquitetônico e conforto visual do usuário."
    },
    amenities: [
      { name: "Piscina Privativa", category: "premium", icon: "Waves" },
      { name: "Banheira Esculpida", category: "premium", icon: "Waves" },
      { name: "Wi-Fi Fibra (400 Mbps)", category: "básica", icon: "Wifi" },
      { name: "Churrasqueira de Charme", category: "cozinha", icon: "ChefHat" },
      { name: "Cozinha Gourmet do Chef", category: "cozinha", icon: "ChefHat" },
      { name: "Ar Condicionado Silencioso", category: "básica", icon: "Wind" }
    ],
    reviews: [
      {
        id: "r1-1",
        author: "Carlos Menezes",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
        rating: 5,
        date: "24 de Mai de 2026",
        comment: "Experiência sensacional! Dormir cercado pelo som do mar e pela brisa leve de Trancoso. A proximidade do Quadrado facilita tudo, mas a paz dentro da propriedade é imbatível."
      },
      {
        id: "r1-2",
        author: "Paula Medeiros",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
        rating: 5,
        date: "12 de Abr de 2026",
        comment: "Cada detalhe rústico é charmoso. A Helena foi super atenciosa, organizou chef local para nosso café da manhã, e o concierge virtual nos deu ótimas dicas de praias desertas."
      }
    ],
    checkInInstructions: "O acesso de veículos é restrito próximo ao Quadrado histórico, facilitando a calmaria. Oferecemos vaga privativa com segurança 24h a 100m da casa. Um mensageiro em carrinho elétrico encontrará você com as chaves para levar suas bagagens direto até a porta."
  },
  {
    id: "prop-2",
    title: "Casa da Praia Milagres & Piscina de Corais",
    description: "Espetacular propriedade pé na areia localizada na lendária Rota Ecológica dos Milagres. Desfrute de um deck suspenso sobre as areias brancas, piscina privativa com borda infinita de frente para as piscinas de corais na maré baixa, serviço de praia privativo e caiaques à disposição.",
    location: "Rota Ecológica, São Miguel dos Milagres, AL",
    city: "São Miguel dos Milagres",
    state: "AL",
    category: "praia",
    pricePerNight: 1650,
    rating: 4.99,
    reviewCount: 98,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 4,
    hostName: "Roberto Lima",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    platformHighlight: {
      source: "Plum Guide",
      benefit: "Teste de Qualidade Crítico Aprovado",
      description: "Testada pessoalmente por críticos de hospitalidade. Atende a mais de 150 critérios rigorosos de conforto e engenharia."
    },
    amenities: [
      { name: "Piscina Borda Infinita", category: "premium", icon: "Waves" },
      { name: "Pé na Areia Exclusivo", category: "premium", icon: "Compass" },
      { name: "Ar-Condicionado nos Quartos", category: "básica", icon: "Wind" },
      { name: "Espaço Gourmet e Churrasqueira", category: "cozinha", icon: "ChefHat" },
      { name: "Caiaques & Stand Up Paddle", category: "entretenimento", icon: "Activity" },
      { name: "Fardamento e Toalhas Premium", category: "básica", icon: "Smile" }
    ],
    reviews: [
      {
        id: "r2-1",
        author: "Mariana Costa",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
        rating: 5,
        date: "02 de Mai de 2026",
        comment: "Simplesmente deslumbrante. Acordar com aquela vista mar turquesa morno é indescritível. A equipe local providenciou peixes e lagostas frescas todos os dias."
      }
    ],
    checkInInstructions: "Acesso por estrada rústica charmosa rodeada por coqueirais. Ao chegar na guarita ecológica da praia de Milagres, identifique-se com o QR Code do app Brisa Nordeste. A equipe residencial estará de braços abertos para recebê-lo com água de coco fresca gelada."
  },
  {
    id: "prop-3",
    title: "Eco-Lodge Secreto Noronha & Vista do Pico",
    description: "Hospede-se no santuário mais exclusivo do Brasil com o máximo respeito ao meio ambiente e requinte absoluto. Este eco-lodge sofisticado oferece piscina térmica privativa suspensa com visual espetacular para o Morro do Pico, amenities de alto luxo, sauna seca e um deck de meditação privativo.",
    location: "Floresta Nova, Fernando de Noronha, PE",
    city: "Fernando de Noronha",
    state: "PE",
    category: "campo",
    pricePerNight: 2300,
    rating: 4.96,
    reviewCount: 52,
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hostName: "Eduardo de Bourbon",
    hostAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80",
    platformHighlight: {
      source: "Vrbo",
      benefit: "Sustentabilidade Premium Certificada",
      description: "Uso de energia 100% solar, captação autônoma de chuva e tratamento de resíduos, sem abrir mão de confortos de classe mundial."
    },
    amenities: [
      { name: "Piscina Térmica Privada", category: "premium", icon: "Waves" },
      { name: "Deck Sunset com Vista Pico", category: "entretenimento", icon: "Sun" },
      { name: "Adega Climatizada", category: "premium", icon: "GlassWater" },
      { name: "Amenities L'Occitane", category: "básica", icon: "Smile" },
      { name: "Ar Condicionado Inverter", category: "básica", icon: "Wind" },
      { name: "Sauna Privativa de Cedro", category: "premium", icon: "Thermometer" }
    ],
    reviews: [
      {
        id: "r3-1",
        author: "Geraldo Alencar",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80",
        rating: 5,
        date: "28 de Mar de 2026",
        comment: "Excelente estadia, privacidade fora do comum na ilha. A vista do pôr do sol sob o Morro do Pico relaxando na nossa piscina aquecida foi incomparável."
      }
    ],
    checkInInstructions: "Nosso concierge no aeroporto de Noronha apoiará no táxi credenciado e nas taxas ambientais. Na propriedade, o mordomo estará à disposição com o cartão eletrônico de acesso e o manual ecológico."
  },
  {
    id: "prop-4",
    title: "Bangalô Premium Jeri Sunset & Jacuzzi",
    description: "Esplêndido bangalô localizado no topo das dunas clássicas de Jericoacoara. Inteiramente climatizado e projetado com madeiras sustentáveis de reflorestamento, possui jacuzzi privativa de hidromassagem no terraço superior com a vista mais privilegiada do pôr do sol, automação por comando de voz e design boho-chic.",
    location: "Dunas Orientais, Jericoacoara, CE",
    city: "Jericoacoara",
    state: "CE",
    category: "apartamento",
    pricePerNight: 980,
    rating: 4.95,
    reviewCount: 167,
    images: [
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473116763269-25541579ffb7?auto=format&fit=crop&w=800&q=80"
    ],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hostName: "Beatriz Nogueira",
    hostAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=120&h=120&q=80",
    platformHighlight: {
      source: "Booking.com",
      benefit: "Garantia de Reserva Instantânea",
      description: "Confirmação e faturamento 100% imediatos, sem necessidade de aprovação manual do anfitrião e com seguro-cancelamento incluso."
    },
    amenities: [
      { name: "Jacuzzi de Luxo no Terraço", category: "premium", icon: "Waves" },
      { name: "Internet Starlink Satélite", category: "básica", icon: "Wifi" },
      { name: "Cozinha Integrada Moderna", category: "cozinha", icon: "ChefHat" },
      { name: "Enxoval Algodão Egípcio", category: "básica", icon: "Smile" },
      { name: "Smart Home & Multimídia", category: "premium", icon: "Tv" }
    ],
    reviews: [
      {
        id: "r4-1",
        author: "Fernanda Castanho",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
        rating: 5,
        date: "05 de Jun de 2026",
        comment: "Que bangalô perfeito! O terraço para ver o pôr do sol em Jericoacoara é exclusivo demais, sem disputa por espaço. Ótima recepção."
      }
    ],
    checkInInstructions: "As credenciais do portão inteligente com fechadura eletrônica são sincronizadas 3 horas antes no app. Lembre-se de reservar seu transfer 4x4 credenciado para a travessia das dunas de Jijoca à vila de Jeri."
  },
  {
    id: "prop-5",
    title: "Oásis Maraú Barra Grande & Deck das Estrelas",
    description: "Um oásis deslumbrante na Península de Maraú, rodeado por palmeiras majestosas e praias de águas mornas. Projetada para famílias refinadas, a propriedade conta com piscina aquecida por energia solar, quiosque gourmet amplo, redário suspenso à beira-rio, horta particular de orgânicos e acesso a passeios de lancha privativa.",
    location: "Praia de Taipu de Fora, Maraú, BA",
    city: "Maraú",
    state: "BA",
    category: "villarural",
    pricePerNight: 1100,
    rating: 4.90,
    reviewCount: 45,
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515404929826-76ffd9f26090?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1482938289607-e9573fc21ebb?auto=format&fit=crop&w=800&q=80"
    ],
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 5,
    hostName: "Claudio Fonseca",
    hostAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
    platformHighlight: {
      source: "Vrbo",
      benefit: "Mais Espaço Para sua Família",
      description: "Casas completas inteiras com áreas abertas amplas, ideais para pet lovers e encontros de gerações com privacidade."
    },
    amenities: [
      { name: "Piscina Solar & Deck Estrelas", category: "premium", icon: "Waves" },
      { name: "Passeio de Lancha Disponível", category: "premium", icon: "Compass" },
      { name: "Cozinha Ampla com Forno Lenha", category: "cozinha", icon: "ChefHat" },
      { name: "Quadra de Areia Integrada", category: "entretenimento", icon: "Activity" },
      { name: "Espaço Amplo de Lazer Pet", category: "básica", icon: "Smile" },
      { name: "Parque Infantil no Jardim", category: "entretenimento", icon: "Smile" }
    ],
    reviews: [
      {
        id: "r5-1",
        author: "Sofia Abrantes",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
        rating: 5,
        date: "14 de Mai de 2026",
        comment: "Incrível! Próximo às piscinas naturais de Taipu de Fora, as crianças amavam fazer snorkel. A casa é espaçosa e o jardim com o deck das estrelas é mágico."
      }
    ],
    checkInInstructions: "O acesso se dá pela portaria residencial de Barra Grande. O funcionário responsável pela recepção aguardará no portão de entrada portando as fitas personalizadas de hóspedes premium e as chaves eletrônicas."
  }
];
