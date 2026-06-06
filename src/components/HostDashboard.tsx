/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building, MapPin, CheckCircle, Waves, Wifi, Wind, 
  HelpCircle, Sparkles, User, Coins, Users, Plus, ShieldCheck
} from "lucide-react";
import { Property, Amenity } from "../types";

interface HostDashboardProps {
  onPropertySaved: () => void;
  existingProperties: Property[];
  onTriggerToast: (msg: string) => void;
}

export default function HostDashboard({ onPropertySaved, existingProperties, onTriggerToast }: HostDashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("BA");
  const [category, setCategory] = useState<Property["category"]>("praia");
  const [pricePerNight, setPricePerNight] = useState<number>(950);
  const [maxGuests, setMaxGuests] = useState<number>(4);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [checkInInstructions, setCheckInInstructions] = useState("");
  const [hostName, setHostName] = useState("Adalberto Café");
  const [customImage, setCustomImage] = useState("");

  // Premium platform highlight simulator
  const [selectedHighlightSource, setSelectedHighlightSource] = useState<"Airbnb" | "Booking.com" | "Vrbo" | "Plum Guide">("Airbnb");
  const [highlightBenefit, setHighlightBenefit] = useState("Selo de Design Excepcional");
  const [highlightDesc, setHighlightDesc] = useState("Acomodação avaliada no topo do design sustentável regional.");

  // Amenities checklist state
  const availableAmenities = [
    { name: "Piscina Privada", category: "premium" as const, icon: "Waves" },
    { name: "Wi-Fi Fibra (500 Mbps)", category: "básica" as const, icon: "Wifi" },
    { name: "Ar Condicionado", category: "básica" as const, icon: "Wind" },
    { name: "Cozinha do Chef", category: "cozinha" as const, icon: "ChefHat" },
    { name: "Pé na Areia Exclusivo", category: "premium" as const, icon: "Compass" },
    { name: "Jacuzzi de Luxo", category: "premium" as const, icon: "Waves" }
  ];
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(["Piscina Privada", "Wi-Fi Fibra (500 Mbps)"]);

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location || !city || !state || !pricePerNight) {
      onTriggerToast("⚠ Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true);

    // Map selected amenities
    const finalAmenities = availableAmenities
      .filter(a => selectedAmenities.includes(a.name))
      .map(a => ({ name: a.name, category: a.category, icon: a.icon }));

    // Choose a high-quality default image based on category if custom image is empty
    const defaultImagesMap: Record<string, string[]> = {
      praia: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80"
      ],
      cabana: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
      ],
      campo: [
        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
      ],
      villarural: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515404929826-76ffd9f26090?auto=format&fit=crop&w=800&q=80"
      ],
      apartamento: [
        "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
      ]
    };

    const chosenImages = customImage.trim() !== "" 
      ? [customImage.trim()] 
      : defaultImagesMap[category] || defaultImagesMap.praia;

    const payload = {
      title,
      description,
      location,
      city,
      state,
      category,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      hostName,
      hostAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
      platformHighlight: {
        source: selectedHighlightSource,
        benefit: highlightBenefit,
        description: highlightDesc
      },
      amenities: finalAmenities,
      checkInInstructions: checkInInstructions || "As chave serão fornecidas pelo porteiro no ato de sua chegada.",
      images: chosenImages
    };

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onTriggerToast("✨ Incrível! Sua propriedade foi cadastrada com sucesso!");
        // Reset form
        setTitle("");
        setDescription("");
        setLocation("");
        setCity("");
        setCheckInInstructions("");
        setCustomImage("");
        setShowForm(false);
        onPropertySaved();
      } else {
        const err = await response.json();
        onTriggerToast(`❌ Erro no cadastro: ${err.error || "Tente novamente"}`);
      }
    } catch (e) {
      console.error(e);
      onTriggerToast("❌ Falha na conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Header Promo */}
      <div className="bg-gradient-to-r from-[#4A5D4E] to-[#2D362F] p-8 rounded-3xl border border-[#E8E4DA]/20 text-white flex flex-col lg:flex-row items-center justify-between gap-6 card-shadow">
        <div className="space-y-2 text-center lg:text-left max-w-2xl">
          <span className="text-[10px] bg-white/20 text-[#D9B68A] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Portal do Proprietário Brisa Nordeste
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-semibold serif">
            Tem um imóvel requintado no Nordeste?
          </h2>
          <p className="text-stone-200 text-xs md:text-sm font-light leading-relaxed">
            Cadastre seu chalé, cabana ou vila e conte com todas as garantias integradas além de fornecer o inovador **Concierge Eletrônico por Inteligência Artificial** para orientar seus hóspedes em tempo real.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#D9B68A] text-[#2D362F] hover:bg-[#c39f75] text-xs uppercase font-bold tracking-wider px-6 py-3.5 rounded-full transition duration-300 flex items-center space-x-2 whitespace-nowrap shrink-0 shadow-md shadow-[#4A5D4E]/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{showForm ? "Ver Meus Imóveis" : "Cadastrar Meu Imóvel"}</span>
        </button>
      </div>

      {showForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Entry */}
          <form 
            onSubmit={handleCreateProperty}
            className="bg-white rounded-3xl border border-[#E8E4DA] p-6 lg:p-8 space-y-6 card-shadow lg:col-span-7"
          >
            <div>
              <h3 className="text-lg font-display font-medium text-[#2D362F] serif text-xl mb-1 flex items-center gap-1.5">
                <Building className="h-5 w-5 text-[#4A5D4E]" />
                <span>Formulário de Cadastro</span>
              </h3>
              <p className="text-stone-500 text-xs">Preencha os dados e configure o acesso eletrônico do hóspede</p>
            </div>

            <div className="space-y-4">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Nome da Estadia *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Chalé Brisa do Coqueiral"
                    className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Estilo de Imóvel *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Property["category"])}
                    className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  >
                    <option value="praia">🏖 Beira Mar</option>
                    <option value="cabana">🏕 Cabana Premium</option>
                    <option value="campo">🏡 Casa de Campo</option>
                    <option value="villarural">🌳 Chácara & Lazer</option>
                    <option value="apartamento">🏢 Cobertura & Design</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Location, City, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Trancoso"
                    className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Estado (UF) *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  >
                    <option value="BA">Bahia (BA)</option>
                    <option value="AL">Alagoas (AL)</option>
                    <option value="PE">Pernambuco (PE)</option>
                    <option value="CE">Ceará (CE)</option>
                    <option value="RN">R. Grande do Norte (RN)</option>
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Preço da Diária *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-xs font-semibold text-stone-400">R$</span>
                    <input
                      type="number"
                      required
                      min="100"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(Number(e.target.value))}
                      className="w-full text-xs pl-8 pr-3 py-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                    />
                  </div>
                </div>
              </div>

              {/* Location details input */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Endereço Completo ou ponto de referência *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Rota Ecológica, Praia do Patacho, São Miguel dos Milagres"
                  className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
              </div>

              {/* Room capacity configurations */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Máx Hóspedes</label>
                  <input
                    type="number"
                    min="1"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Quartos</label>
                  <input
                    type="number"
                    min="1"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Banheiros</label>
                  <input
                    type="number"
                    min="1"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  />
                </div>
              </div>

              {/* Image URL Input Optional */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Link de foto do Imóvel (Opcional)</label>
                <input
                  type="url"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-... (deixe em branco para usar lindas fotos padrão)"
                  className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
              </div>

              {/* Description box */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70">Descrição da Experiência *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Conte os detalhes do seu imóvel, design rústico, paisagens típicas locais e comodidades vizinhas."
                  className="w-full text-xs p-3 bg-[#F8F6F2]/45 border border-[#E8E4DA] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
              </div>

              {/* Check-In Instructions (Extremely important for concierge matching) */}
              <div className="space-y-1.5 bg-[#F8F6F2]/60 p-4 rounded-2xl border border-[#E8E4DA/60]">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#4A5D4E]" />
                  <label className="text-[11px] uppercase font-bold text-[#4A5D4E]">Instruções Eletrônicas de Check-in *</label>
                </div>
                <p className="text-[11px] text-stone-500 mb-1 leading-relaxed">
                  Essas informações alimentam o **Concierge Virtual** de inteligência artificial para que os hóspedes obtenham as instruções corretas de acesso:
                </p>
                <textarea
                  rows={2}
                  required
                  value={checkInInstructions}
                  onChange={(e) => setCheckInInstructions(e.target.value)}
                  placeholder="Ex: O acesso de entrada exige senha numérica enviada no ato. A senha para o portão inteligente da frente é #1980#"
                  className="w-full text-xs p-3 bg-white border border-[#E8E4DA] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
              </div>

              {/* Premium Verification source simulated highlight */}
              <div className="space-y-3.5 bg-stone-50 p-4 rounded-2xl border border-[#E8E4DA]/50">
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4 text-[#D9B68A]" />
                  <h4 className="text-xs font-bold uppercase text-[#2D362F]">Destaque e Curadoria Premium</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500">Garantia Integrada de Canal</label>
                    <select
                      value={selectedHighlightSource}
                      onChange={(e) => setSelectedHighlightSource(e.target.value as any)}
                      className="w-full text-xs p-2 bg-white border border-[#E8E4DA] rounded-xl"
                    >
                      <option value="Airbnb">Selo Airbnb (Estilo e Design)</option>
                      <option value="Booking.com">Selo Booking.com (Faturamento Instantâneo)</option>
                      <option value="Vrbo">Selo Vrbo (Familiaridade Premium)</option>
                      <option value="Plum Guide">Selo Plum Guide (Vistoria de Alta Excelência)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-stone-500">Destaque de Valor Exclusivo</label>
                    <input
                      type="text"
                      value={highlightBenefit}
                      onChange={(e) => setHighlightBenefit(e.target.value)}
                      placeholder="Ex: Vista Total das Piscinas de Corais"
                      className="w-full text-xs p-2 bg-white border border-[#E8E4DA] rounded-xl placeholder:text-stone-300"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities multi-selector tags */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold text-[#4A5D4E]/70 block">Selecione as Comodidades Disponíveis</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {availableAmenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity.name);
                    return (
                      <button
                        key={amenity.name}
                        type="button"
                        onClick={() => toggleAmenity(amenity.name)}
                        className={`text-[11px] px-3.5 py-1.5 rounded-full border transition cursor-pointer flex items-center space-x-1.5 ${isSelected ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]' : 'bg-white text-stone-600 border-[#E8E4DA]'}`}
                      >
                        {amenity.icon === "Waves" && <Waves className="h-3 w-3" />}
                        {amenity.icon === "Wifi" && <Wifi className="h-3 w-3" />}
                        {amenity.icon === "Wind" && <Wind className="h-3 w-3" />}
                        <span>{amenity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs font-semibold px-4 py-2.5 hover:bg-stone-50 rounded-full transition text-stone-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#4A5D4E] text-white hover:bg-[#344237] text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition disabled:opacity-50 cursor-pointer shadow-md shadow-[#4A5D4E]/10"
              >
                {isLoading ? "Enviando para Auditoria..." : "Publicar Meu Imóvel"}
              </button>
            </div>
          </form>

          {/* Real-time elegant Live Preview card */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#A47E5B] font-bold block">
              ✨ Visualização Dinâmica em Tempo Real
            </span>
            
            {/* Mock Property Card */}
            <div className="bg-white rounded-3xl border border-[#E8E4DA] overflow-hidden card-shadow transition duration-500 relative">
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img
                  src={
                    customImage.trim() !== "" 
                      ? customImage 
                      : category === "praia" ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                      : "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={title || "Nome provisório do Imóvel"}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#2D362F] text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#E8E4DA]/50 shadow-3xs">
                  🌿 {category.toUpperCase()}
                </span>
                
                <span className="absolute top-4 right-4 bg-[#2D362F]/95 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-md">
                  ★ 5.0 (Novo)
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#A47E5B] tracking-wider">
                    {selectedHighlightSource} • {highlightBenefit || "Lançamento"}
                  </span>
                  <div className="text-right">
                    <span className="text-[#4A5D4E] text-xs font-bold">R$ {pricePerNight}</span>
                    <span className="text-[9px] text-stone-400 block -mt-1 leading-none">por noite</span>
                  </div>
                </div>

                <h3 className="font-display font-medium text-lg text-[#2D362F] serif capitalize leading-tight">
                  {title || "Escreva o título do seu imóvel de luxo"}
                </h3>

                <p className="text-stone-500 text-xs flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#4A5D4E]/80" />
                  <span>{location || "Endereço, Cidade, Estado"}</span>
                </p>

                <p className="text-stone-600 text-[11px] leading-relaxed font-light line-clamp-2">
                  {description || "A história cativante da sua propriedade aparecerá aqui de forma elegante para encantar o usuário final."}
                </p>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-[10px] font-light text-stone-500">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {maxGuests} convivas</span>
                    <span>•</span>
                    <span>{bedrooms} quartos</span>
                  </div>

                  <span className="text-[9px] bg-[#4A5D4E]/10 text-[#4A5D4E] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Estilo Ativo
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F6F2] p-4 rounded-2xl border border-[#E8E4DA] text-xs text-[#4A5D4E] space-y-1.5">
              <p className="font-semibold">💡 Configurando para Android:</p>
              <p className="font-light leading-relaxed">
                Nossos cadastros alimentam diretamente a base sincronizada. No emulador ou dispositivo móvel Android, essas informações atualizam instantaneamente via WebSocket ou Pooling seguro sem travar as transações de reserva.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Host Imóveis list display view */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-medium text-[#2D362F] serif text-xl flex items-center gap-2">
                <Building className="h-5 w-5 text-[#4A5D4E]" />
                <span>Casas Pertencentes a Você</span>
              </h3>
              <p className="text-stone-500 text-xs">Exibindo os imóveis de temporada cadastrados que recebem as garantias da Brisa Nordeste</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map host properties of Adalberto Coffee */}
            {existingProperties
              .filter(p => p.hostName === "Adalberto Café" || p.id.startsWith("prop-custom") || p.id.startsWith("prop-") && !["prop-1", "prop-2", "prop-3", "prop-4", "prop-5"].includes(p.id))
              .map((property) => (
                <div 
                  key={property.id}
                  className="bg-white rounded-3xl border border-[#E8E4DA] overflow-hidden card-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-36">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2.5 left-2.5 bg-[#4A5D4E] text-stone-100 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                        {property.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-[#A47E5B] uppercase">{property.platformHighlight.source}</span>
                        <span className="text-xs font-semibold text-stone-800">R$ {property.pricePerNight} / noite</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#2D362F] truncate">{property.title}</h4>
                      <p className="text-[10px] text-stone-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{property.city}, {property.state}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8F6F2] p-3 px-4 flex items-center justify-between border-t border-[#E8E4DA]/55">
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                      ● Ativo na Vitrine
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold">{property.reviewCount} avaliações</span>
                  </div>
                </div>
              ))}

            {/* Card placeholder to list first property if they haven't listed any */}
            {existingProperties.filter(p => p.hostName === "Adalberto Café" || p.id.startsWith("prop-custom") || p.id.startsWith("prop-") && !["prop-1", "prop-2", "prop-3", "prop-4", "prop-5"].includes(p.id)).length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-[#E8E4DA] p-8 card-shadow flex flex-col items-center justify-center space-y-3">
                <Building className="h-10 w-10 text-[#4A5D4E]/30" />
                <h4 className="font-bold text-[#2D362F] text-sm font-display serif text-base">Nenhum imóvel listado por você</h4>
                <p className="text-stone-500 text-xs max-w-sm leading-relaxed font-light">
                  Seja o primeiro a lucrar de forma segura! Clique no botão superior direito **Cadastrar Meu Imóvel** para listar seu espaço no Nordeste e ativar nosso suporte ao hóspede.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
