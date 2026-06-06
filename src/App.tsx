/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, Ticket, Bot, Search, SlidersHorizontal, Sparkles, 
  MapPin, CheckCircle, Flame, Waves, HelpCircle, Utensils, 
  ShieldCheck, ArrowRight, UserCheck, Star, AppWindow, Building
} from "lucide-react";
import { Property, Booking } from "./types";
import { SAMPLE_PROPERTIES } from "./data";
import PropertyCard from "./components/PropertyCard";
import PropertyDetailsModal from "./components/PropertyDetailsModal";
import VirtualConcierge from "./components/VirtualConcierge";
import ReservationsList from "./components/ReservationsList";
import HostDashboard from "./components/HostDashboard";

export default function App() {
  // Navigation active state: "explorer" | "bookings" | "concierge" | "hosting"
  const [activeTab, setActiveTab] = useState<"explorer" | "bookings" | "concierge" | "hosting">("explorer");

  // Filter conditions
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [maxBudget, setMaxBudget] = useState<number>(2500);

  // States
  const [allProperties, setAllProperties] = useState<Property[]>(SAMPLE_PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(SAMPLE_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [activePropertyForConcierge, setActivePropertyForConcierge] = useState<Property | null>(SAMPLE_PROPERTIES[0]);

  // Loading states
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch properties helper
  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setAllProperties(data);
      }
    } catch (e) {
      console.error("Erro ao carregar imóveis:", e);
    }
  };

  // Fetch bookings helper
  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setUserBookings(data);
      }
    } catch (e) {
      console.error("Erro ao carregar reservas:", e);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Load Bookings and Properties on startup
  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, []);

  // Filter computation
  useEffect(() => {
    let result = allProperties;

    // Search query match (Title or Location/City/State)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query)
      );
    }

    // Category match
    if (selectedCategory !== "todos") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price range match
    result = result.filter((p) => p.pricePerNight <= maxBudget);

    setFilteredProperties(result);
  }, [searchQuery, selectedCategory, maxBudget, allProperties]);

  // Quick Action triggers
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleBookingCompleted = (newBooking: Booking) => {
    fetchBookings();
    triggerToast("✨ Reserva instantânea confirmada e integrada ao Concierge!");
    
    // Settle selected lodging as active concierge item
    const targetProperty = allProperties.find(p => p.id === newBooking.propertyId);
    if (targetProperty) {
      setActivePropertyForConcierge(targetProperty);
    }
    
    // Switch view to bookings tab or concierge chat
    setTimeout(() => {
      setActiveTab("bookings");
    }, 1200);
  };

  const handleSpeakWithConcierge = (property: Property) => {
    setActivePropertyForConcierge(property);
    setActiveTab("concierge");
    triggerToast(`🛎 Sincronizado chat concierge para: ${property.city}`);
  };

  return (
    <div id="vivienda-app-root" className="min-h-screen flex flex-col bg-[#F8F6F2] text-[#2D362F] selection:bg-[#4A5D4E]/20 selection:text-[#4A5D4E]">
      
      {/* Toast alert system */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#2D362F] text-stone-100 text-xs py-3 px-6 rounded-2xl shadow-xl flex items-center space-x-2 border border-[#4A5D4E]/30 animate-slide-in">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Top majestic navigation bar */}
      <header className="bg-white/60 backdrop-blur-md border-b border-[#E8E4DA] sticky top-0 z-40 shadow-3xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & slogan */}
          <div className="flex items-center space-x-2.5">
            <div className="h-10 w-10 bg-[#4A5D4E] rounded-full flex items-center justify-center text-white serif italic text-xl">
              B
            </div>
            <div>
              <span className="text-2xl font-display font-medium text-[#2D362F] tracking-tight block">Brisa Nordeste</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A47E5B] block -mt-1 leading-none">
                Aluguéis & Charme
              </span>
            </div>
          </div>

          {/* Center Tabs selection */}
          <nav className="hidden md:flex space-x-1.5 bg-[#E8E4DA]/40 p-1 rounded-xl">
            <button
              id="tab-explorer-desktop"
              onClick={() => setActiveTab("explorer")}
              className={`flex items-center space-x-1.5 px-4 h-8 text-xs font-semibold rounded-lg transition-all ${activeTab === 'explorer' ? 'bg-white text-[#2D362F] shadow-3xs' : 'text-[#4A5D4E]/70 hover:text-[#4A5D4E]'}`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Explorar Estadias</span>
            </button>
            <button
              id="tab-bookings-desktop"
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center space-x-1.5 px-4 h-8 text-xs font-semibold rounded-lg transition-all ${activeTab === 'bookings' ? 'bg-white text-[#2D362F] shadow-3xs' : 'text-[#4A5D4E]/70 hover:text-[#4A5D4E]'}`}
            >
              <Ticket className="h-3.5 w-3.5" />
              <span>Minhas Reservas ({userBookings.length})</span>
            </button>
            <button
              id="tab-concierge-desktop"
              onClick={() => setActiveTab("concierge")}
              className={`flex items-center space-x-1.5 px-4 h-8 text-xs font-semibold rounded-lg transition-all ${activeTab === 'concierge' ? 'bg-white text-[#2D362F] shadow-3xs' : 'text-[#4A5D4E]/70 hover:text-[#4A5D4E]'}`}
            >
              <Bot className="h-3.5 w-3.5 text-[#4A5D4E]" />
              <span>Concierge Virtual 24h</span>
            </button>
            <button
              id="tab-hosting-desktop"
              onClick={() => setActiveTab("hosting")}
              className={`flex items-center space-x-1.5 px-4 h-8 text-xs font-semibold rounded-lg transition-all ${activeTab === 'hosting' ? 'bg-[#4A5D4E] text-white shadow-3xs' : 'text-[#4A5D4E]/70 hover:text-[#4A5D4E]'}`}
            >
              <Building className="h-3.5 w-3.5" />
              <span>Modo Anfitrião</span>
            </button>
          </nav>

          {/* User Active Account Hub */}
          <div className="flex items-center space-x-3 bg-white/70 p-2 px-3.5 rounded-2xl border border-[#E8E4DA]">
            <div className="h-8 w-8 rounded-full bg-[#4A5D4E]/10 border border-[#4A5D4E]/20 flex items-center justify-center text-[#4A5D4E] font-bold text-xs uppercase shadow-3xs">
              AC
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold font-display text-[#2D362F]">Adalberto Café</span>
                <span className="text-[8px] bg-[#E8E4DA] text-[#4A5D4E] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">VIP</span>
              </div>
              <span className="text-[10px] text-stone-400 block -mt-0.5">adalberto.cafe1982@gmail.com</span>
            </div>
          </div>

        </div>
      </header>

      {/* Hero Header Presentation */}
      <section className="py-12 md:py-16 text-center relative overflow-hidden shrink-0 border-b border-[#E8E4DA]">
        <div className="max-w-4xl mx-auto px-4 space-y-4 relative z-10">
          <span className="text-xs font-bold text-[#A47E5B] uppercase tracking-widest block font-sans">
            ⭐ O Melhor de Cada Aplicativo em um Só Lugar
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-medium leading-none text-[#2D362F]">
            Sinta-se em casa,<br />
            <span className="italic text-[#A47E5B]">em qualquer lugar.</span>
          </h1>
          <p className="text-[#4A5D4E]/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Reunimos a sofisticação de design do <strong>Airbnb</strong>, o controle estrito de padrão do <strong>Plum Guide</strong>, o faturamento instantâneo garantido do <strong>Booking.com</strong> e o conforto para a sua família do <strong>Vrbo</strong> — com suporte VIP personalizado de concierge 24h.
          </p>

          {/* Rapid features bullets */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold tracking-wide text-[#4A5D4E]/85 uppercase pt-2">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/60 border border-[#E8E4DA] shadow-3xs">
              <ShieldCheck className="h-3.5 w-3.5 text-[#4A5D4E]" />
              <span>Garantia de Antifraude</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/60 border border-[#E8E4DA] shadow-3xs">
              <Bot className="h-3.5 w-3.5 text-[#4A5D4E]" />
              <span>Mordomo IA Integrado</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/60 border border-[#E8E4DA] shadow-3xs">
              <UserCheck className="h-3.5 w-3.5 text-[#4A5D4E]" />
              <span>Anfitriões Verificados</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content layout Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile top tabs bar */}
        <div className="flex md:hidden border-b border-stone-200 mb-6 bg-white p-1 rounded-2xl shadow-3xs">
          <button
            onClick={() => setActiveTab("explorer")}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl ${activeTab === 'explorer' ? 'bg-[#4A5D4E] text-white' : 'text-[#4A5D4E]/80'}`}
          >
            Vitrine
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl ${activeTab === 'bookings' ? 'bg-[#4A5D4E] text-white' : 'text-[#4A5D4E]/80'}`}
          >
            Reservas ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("concierge")}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl ${activeTab === 'concierge' ? 'bg-[#4A5D4E] text-white' : 'text-[#4A5D4E]/80'}`}
          >
            Concierge IA
          </button>
          <button
            onClick={() => setActiveTab("hosting")}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-xl ${activeTab === 'hosting' ? 'bg-[#4A5D4E] text-white' : 'text-[#4A5D4E]/80'}`}
          >
            Anfitrião
          </button>
        </div>

        {/* Tab 1: Explorer Vitrine */}
        {activeTab === "explorer" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Filter Hub Widget */}
            <div className="bg-white rounded-3xl border border-[#E8E4DA] p-6 shadow-3xs space-y-5 card-shadow">
              
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="flex-1 w-full relative">
                  <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#4A5D4E]/50 focus:text-[#4A5D4E] transition" />
                  <input 
                    id="search-input-field"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar por destino no Nordeste: Trancoso, Milagres, Noronha, Jericoacoara..."
                    className="w-full pl-11 pr-4 py-3 text-xs bg-[#F8F6F2]/50 hover:bg-[#F8F6F2]/30 border border-[#E8E4DA] rounded-2xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] focus:border-[#4A5D4E]"
                  />
                </div>

                {/* Slider budget input */}
                <div className="w-full lg:w-80 space-y-1.5 bg-[#F8F6F2]/50 p-3 rounded-2xl border border-[#E8E4DA] flex flex-col justify-center">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#4A5D4E]/75">Teto de Diária:</span>
                    <strong className="text-[#4A5D4E]">R$ {maxBudget} / noite</strong>
                  </div>
                  <input 
                    type="range"
                    min="650"
                    max="2500"
                    step="50"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E8E4DA] rounded-lg appearance-none cursor-pointer accent-[#4A5D4E]"
                  />
                </div>
              </div>

              {/* Horizontal scroll selection for lodging category tags */}
              <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCategory("todos")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${selectedCategory === 'todos' ? 'bg-[#4A5D4E] text-white shadow-xs' : 'bg-[#E8E4DA]/40 text-[#4A5D4E]/80 hover:bg-[#E8E4DA]/70'}`}
                >
                  🌿 Todos os Estilos
                </button>
                <button
                  onClick={() => setSelectedCategory("cabana")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5 ${selectedCategory === 'cabana' ? 'bg-[#4A5D4E] text-white shadow-xs' : 'bg-[#E8E4DA]/40 text-[#4A5D4E]/80 hover:bg-[#E8E4DA]/70'}`}
                >
                  <Flame className="h-3.5 w-3.5 shrink-0" />
                  <span>Cabanas Premium</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("praia")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5 ${selectedCategory === 'praia' ? 'bg-[#4A5D4E] text-white shadow-xs' : 'bg-[#E8E4DA]/40 text-[#4A5D4E]/80 hover:bg-[#E8E4DA]/70'}`}
                >
                  <Waves className="h-3.5 w-3.5 shrink-0" />
                  <span>Beira Mar</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("campo")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5 ${selectedCategory === 'campo' ? 'bg-[#4A5D4E] text-white shadow-xs' : 'bg-[#E8E4DA]/40 text-[#4A5D4E]/80 hover:bg-[#E8E4DA]/70'}`}
                >
                  <Compass className="h-3.5 w-3.5 shrink-0" />
                  <span>Casas do Campo</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("apartamento")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5 ${selectedCategory === 'apartamento' ? 'bg-[#4A5D4E] text-white shadow-xs' : 'bg-[#E8E4DA]/40 text-[#4A5D4E]/80 hover:bg-[#E8E4DA]/70'}`}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>Coberturas & Design</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("villarural")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5 ${selectedCategory === 'villarural' ? 'bg-[#4A5D4E] text-white shadow-xs' : 'bg-[#E8E4DA]/40 text-[#4A5D4E]/80 hover:bg-[#E8E4DA]/70'}`}
                >
                  <Compass className="h-3.5 w-3.5 shrink-0" />
                  <span>Chácaras & Lazer</span>
                </button>
              </div>

            </div>

            {/* List Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-semibold text-stone-900">
                  Residências de Conforto Incomparável
                </h2>
                <p className="text-stone-500 text-xs">Exiba estadias requintadas prontas para reserva instantânea</p>
              </div>

              <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-xl font-semibold border border-stone-200">
                Amostra: <strong>{filteredProperties.length} imóveis</strong>
              </span>
            </div>

            {/* Property Cards list */}
            {filteredProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
                <SlidersHorizontal className="h-10 w-10 text-stone-300 mx-auto" />
                <h3 className="font-display font-medium text-stone-900 mt-2">Nenhum imóvel corresponde ao filtro</h3>
                <p className="text-stone-500 text-xs mt-1">Aumente o teto de diária ou troque seus termos de busca.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onSelect={(prop) => setSelectedProperty(prop)}
                  />
                ))}
              </div>
            )}
            
          </div>
        )}

        {/* Tab 2: Reservations Management Panel */}
        {activeTab === "bookings" && (
          <div className="animate-fade-in space-y-6">
            <ReservationsList 
              bookings={userBookings}
              properties={allProperties}
              onSelectPropertyForChat={handleSpeakWithConcierge}
              onRefresh={fetchBookings}
            />

            {/* General Concierge Promo action */}
            <div className="bg-gradient-to-r from-[#4A5D4E] to-[#2D362F] p-6 rounded-3xl border border-[#E8E4DA]/30 text-white flex flex-col md:flex-row items-center justify-between gap-4 mt-8 card-shadow">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] uppercase font-bold text-[#D9B68A] tracking-wider">Suporte Concierge Ativo</span>
                <h3 className="text-lg font-display font-medium serif italic">Deseja assistência geral ou recomendações de voos?</h3>
                <p className="text-stone-200 text-xs font-light max-w-xl leading-relaxed">
                  Nosso mordomo digital pode recomendar atrações turísticas, guias de locomoção ou responder regras de convívio geral na plataforma Brisa Nordeste.
                </p>
              </div>
              <button
                onClick={() => {
                  setActivePropertyForConcierge(null);
                  setActiveTab("concierge");
                }}
                className="bg-[#D9B68A] text-[#2D362F] hover:bg-[#c39f75] text-xs uppercase font-bold tracking-wider px-5 py-3 rounded-full transition duration-300 flex items-center space-x-1.5 whitespace-nowrap shrink-0 shadow-md shadow-[#4A5D4E]/20"
              >
                <span>Chamar Concierge</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Direct Virtual Concierge AI chat portal */}
        {activeTab === "concierge" && (
          <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
            
            {/* Top configuration panel to switch contextual home target directly */}
            <div className="bg-white p-5 rounded-3xl border border-[#E8E4DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-shadow">
              <div>
                <h2 className="text-base font-display font-semibold text-[#2D362F] flex items-center space-x-1.5">
                  <Bot className="h-5 w-5 text-[#4A5D4E]" />
                  <span className="serif text-lg">Contexto de Atendimento do Mordomo</span>
                </h2>
                <p className="text-[#4A5D4E]/70 text-xs mt-0.5">Altere o foco do atendimento inteligente para o seu imóvel de preferência</p>
              </div>

              <div className="w-full sm:w-auto">
                <select 
                  value={activePropertyForConcierge?.id || "geral"}
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id === "geral") {
                      setActivePropertyForConcierge(null);
                    } else {
                      const prop = allProperties.find(p => p.id === id);
                      if (prop) setActivePropertyForConcierge(prop);
                    }
                  }}
                  className="w-full sm:w-80 text-xs p-2 rounded-xl border border-[#E8E4DA] bg-[#F8F6F2] hover:bg-[#F8F6F2]/50 cursor-pointer focus:outline-none"
                >
                  <option value="geral">🌿 Exploração Geral / Dúvidas Brisa Nordeste</option>
                  {allProperties.map((p) => (
                    <option key={p.id} value={p.id}>🏡 {p.city} • {p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <VirtualConcierge 
              activeProperty={activePropertyForConcierge}
              guestName="Adalberto Café"
            />
          </div>
        )}

        {/* Tab 4: Host Property Registry Dashboard Workspace */}
        {activeTab === "hosting" && (
          <div className="animate-fade-in space-y-6">
            <HostDashboard 
              onPropertySaved={fetchProperties}
              existingProperties={allProperties}
              onTriggerToast={triggerToast}
            />
          </div>
        )}

      </main>

      {/* Footer information section with brand value credit */}
      <footer className="p-12 bg-[#F0EEE6] border-t border-[#E8E4DA] text-xs shrink-0 text-[#2D362F]/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row gap-12 text-center md:text-left">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#4A5D4E]/60 font-bold mb-1">Suporte Concierge 24h</span>
              <span className="text-sm font-medium flex items-center justify-center md:justify-start gap-2 text-[#2D362F]">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                Especialista & Bot Ativos 24/7
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#4A5D4E]/60 font-bold mb-1">Experiência Brisa Nordeste</span>
              <span className="text-sm font-medium text-[#2D362F]">Reserva instantânea, curadoria & mordomo</span>
            </div>
          </div>

          <div className="bg-white px-6 py-4 rounded-2xl flex items-center gap-4 card-shadow border border-white/50 text-left">
            <div className="w-10 h-10 rounded-full bg-[#D9B68A] flex items-center justify-center text-white text-lg">
              💬
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-tight text-[#2D362F]">Fale com o Concierge IA</p>
              <p className="text-[10px] text-[#4A5D4E]/80">Suporte personalizado para regras ou guias de acesso.</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-[#4A5D4E]/50 text-[10px] uppercase tracking-wider font-semibold mt-8 pt-6 border-t border-[#E8E4DA]/40">
          © 2026 Brisa Nordeste Inc. Todos os direitos reservados.
        </div>
      </footer>

      {/* Main detail modal popup portal for instant reservation calculation */}
      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onBookingSuccess={handleBookingCompleted}
        />
      )}

    </div>
  );
}
