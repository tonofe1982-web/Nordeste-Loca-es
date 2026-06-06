/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  X, Star, Users, Bed, Bath, Sparkles, Check, Info, Calendar, 
  MapPin, Send, Waves, Flame, Wifi, ChefHat, Tv, Compass, Wind, 
  Activity, Thermometer, GlassWater, Sun, Smile, Key, CheckCircle, Mail, User
} from "lucide-react";
import { Property, Booking } from "../types";

// Safety icon mapper to avoid strict typescript resolution issues
const getAmenityIcon = (iconName: string) => {
  switch (iconName) {
    case "Waves": return <Waves className="h-5 w-5 text-[#4A5D4E]" />;
    case "Flame": return <Flame className="h-5 w-5 text-[#4A5D4E]" />;
    case "Wifi": return <Wifi className="h-5 w-5 text-[#4A5D4E]" />;
    case "ChefHat": return <ChefHat className="h-5 w-5 text-[#4A5D4E]" />;
    case "Tv": return <Tv className="h-5 w-5 text-[#4A5D4E]" />;
    case "Compass": return <Compass className="h-5 w-5 text-[#4A5D4E]" />;
    case "Wind": return <Wind className="h-5 w-5 text-[#4A5D4E]" />;
    case "Activity": return <Activity className="h-5 w-5 text-[#4A5D4E]" />;
    case "Thermometer": return <Thermometer className="h-5 w-5 text-[#4A5D4E]" />;
    case "GlassWater": return <GlassWater className="h-5 w-5 text-[#4A5D4E]" />;
    case "Sun": return <Sun className="h-5 w-5 text-[#4A5D4E]" />;
    case "Key": return <Key className="h-5 w-5 text-[#4A5D4E]" />;
    default: return <Smile className="h-5 w-5 text-[#4A5D4E]" />;
  }
};

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export default function PropertyDetailsModal({ property, onClose, onBookingSuccess }: PropertyDetailsModalProps) {
  // Pre-filling date range: tomorrow to 3 days later
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split("T")[0];

  const defaultOut = new Date();
  defaultOut.setDate(defaultOut.getDate() + 4);
  const formattedDefaultOut = defaultOut.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(formattedTomorrow);
  const [checkOut, setCheckOut] = useState(formattedDefaultOut);
  const [guestsCount, setGuestsCount] = useState(2);
  const [guestName, setGuestName] = useState("Adalberto Café");
  const [guestEmail, setGuestEmail] = useState("adalberto.cafe1982@gmail.com");

  const [nights, setNights] = useState(3);
  const [pricing, setPricing] = useState({
    subtotal: 0,
    cleaningFee: 150,
    viviendaTax: 95,
    total: 0,
  });

  const [bookingDone, setBookingDone] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Recalculate nights and totals when dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffNights > 0) {
        setNights(diffNights);
        setErrorText("");
        const subtotal = diffNights * property.pricePerNight;
        const total = subtotal + pricing.cleaningFee + pricing.viviendaTax;
        setPricing(prev => ({
          ...prev,
          subtotal,
          total
        }));
      } else {
        setNights(0);
        setErrorText("A data de checkout deve ser posterior ao checkin.");
      }
    }
  }, [checkIn, checkOut, property.pricePerNight]);

  const handleBookInstant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nights <= 0) {
      setErrorText("Por favor, selecione um intervalo de datas válido.");
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setErrorText("Preencha seu nome e e-mail para validar a faturamento instantâneo.");
      return;
    }

    setIsSubmitting(true);
    setErrorText("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          propertyImage: property.images[0],
          propertyLocation: property.location,
          checkIn,
          checkOut,
          guestsCount,
          totalPrice: pricing.total,
          guestName,
          guestEmail
        })
      });

      if (!response.ok) {
        throw new Error("Erro na rede ou validação do faturamento.");
      }

      const createdBooking: Booking = await response.json();
      setBookingDone(createdBooking);
      onBookingSuccess(createdBooking);
    } catch (err: any) {
      console.error(err);
      setErrorText("Houve um contratempo para confirmar sua reserva instantly. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id={`property-modal-${property.id}`}
        className="bg-[#F8F6F2] rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] border border-[#E8E4DA]"
      >
        
        {/* Left Side: Images & Info scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Header row */}
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A47E5B]">
                Reserva Instantânea Garantida
              </span>
              <h2 className="text-2xl md:text-3.5xl font-display font-medium text-[#2D362F] mt-1 serif">
                {property.title}
              </h2>
              <p className="text-stone-500 text-sm mt-1 flex items-center space-x-1">
                <MapPin className="h-4 w-4 shrink-0 text-[#4A5D4E]/80" />
                <span>{property.location}</span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center space-x-1">
                  <Star className="h-3.5 w-3.5 fill-[#D9B68A] text-[#D9B68A]" />
                  <strong className="text-[#2D362F] font-semibold">{property.rating.toFixed(2)}</strong>
                  <span>({property.reviewCount} avaliações)</span>
                </span>
              </p>
            </div>
            
            {/* Close Mobile button */}
            <button 
              id="close-modal-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-[#E8E4DA]/50 hover:bg-[#E8E4DA] text-[#2D362F] transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Visual Display: Main big photo + secondary side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 rounded-2xl overflow-hidden shadow-xs">
            <img 
              src={property.images[0]} 
              alt={property.title}
              referrerPolicy="no-referrer"
              className="sm:col-span-2 w-full h-64 md:h-80 object-cover hover:brightness-95 transition cursor-pointer"
            />
            <div className="hidden sm:flex flex-col gap-3.5">
              {property.images.slice(1, 3).map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`${property.title}-thumb-${idx}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-[148px] object-cover hover:brightness-95 transition cursor-pointer rounded-r-lg"
                />
              ))}
            </div>
          </div>

          {/* Accommodation Attributes */}
          <div className="flex flex-wrap gap-4 border-y border-[#E8E4DA] py-4 text-[#2D362F] text-sm">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E8E4DA]/20 border border-[#E8E4DA]/30 rounded-lg">
              <Users className="h-4 w-4 text-[#4A5D4E]/80" />
              <span>Acomoda até <strong>{property.maxGuests} Hóspedes</strong></span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E8E4DA]/20 border border-[#E8E4DA]/30 rounded-lg">
              <Bed className="h-4 w-4 text-[#4A5D4E]/80" />
              <span><strong>{property.bedrooms} Quartos</strong></span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E8E4DA]/20 border border-[#E8E4DA]/30 rounded-lg">
              <Bath className="h-4 w-4 text-[#4A5D4E]/80" />
              <span><strong>{property.bathrooms} Banheiros</strong></span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E8E4DA]/20 border border-[#E8E4DA]/30 rounded-lg">
              <Key className="h-4 w-4 text-[#4A5D4E]/80" />
              <span>Check-in Inteligente</span>
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-display font-medium text-lg text-[#2D362F] border-l-4 border-[#4A5D4E] pl-3 serif">
              Descrição do Espaço
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed mt-3 whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Amenities checklist grouped */}
          <div>
            <h4 className="font-display font-medium text-lg text-[#2D362F] border-l-4 border-[#4A5D4E] pl-3 serif">
              O que este lugar oferece
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {property.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center space-x-3.5 bg-white p-3 rounded-xl border border-[#E8E4DA] card-shadow">
                  <div className="p-2 rounded-lg bg-[#F8F6F2]">
                    {getAmenityIcon(amenity.icon)}
                  </div>
                  <div>
                    <span className="text-[#2D362F] font-medium text-sm block">{amenity.name}</span>
                    <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider">{amenity.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions preview */}
          <div className="bg-[#E8E4DA]/25 border border-[#E8E4DA] p-5 rounded-2xl">
            <h4 className="font-display font-medium text-[#2D362F] flex items-center space-x-2 serif">
              <Key className="h-5 w-5 text-[#A47E5B]" />
              <span>Guia de Acesso Integrado 24h</span>
            </h4>
            <p className="text-[#2D362F]/80 text-xs leading-relaxed mt-2.5 font-light">
              Ao concluir esta reserva, você recebe acesso imediato e o nosso Concierge IA passará a ajudá-lo guiando a casa ativa.
            </p>
            <div className="mt-3.5 text-[#2D362F]/95 bg-white p-3 rounded-xl text-xs border border-[#E8E4DA] italic">
              <strong>Procedimento padrão:</strong> "{property.checkInInstructions}"
            </div>
          </div>

          {/* Host representation */}
          <div className="flex items-center space-x-4 bg-white p-5 rounded-2xl border border-[#E8E4DA] card-shadow">
            <img 
              src={property.hostAvatar} 
              alt={property.hostName} 
              referrerPolicy="no-referrer"
              className="h-12 w-12 rounded-full object-cover shrink-0 border border-[#E8E4DA]"
            />
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-widest">Seu Anfitrião Premium</span>
              <h5 className="font-display font-medium text-[#2D362F] text-sm serif">{property.hostName}</h5>
              <p className="text-xs text-stone-500 mt-0.5">Superhost focado na curadoria de pequenos detalhes artísticos.</p>
            </div>
          </div>

          {/* Guest Reviews list */}
          <div>
            <h4 className="font-display font-medium text-[#2D362F] flex items-center gap-2 mb-4 serif text-lg">
              <span>Opinião de quem já se hospedou</span>
              <span className="text-xs bg-[#E8E4DA] text-[#4A5D4E] font-bold px-2 py-0.5 rounded-full">
                {property.rating.toFixed(2)} ★
              </span>
            </h4>
            <div className="space-y-4">
              {property.reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-[#E8E4DA]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={rev.avatar} 
                        alt={rev.author} 
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <h5 className="font-semibold text-stone-900 text-xs">{rev.author}</h5>
                        <p className="text-stone-400 text-[10px]">{rev.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-[#D9B68A] text-[#D9B68A]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 font-light text-xs mt-3 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Sticky Checkout Calculator Card */}
        <div className="w-full md:w-[390px] bg-white border-t md:border-t-0 md:border-l border-[#E8E4DA] p-6 flex flex-col justify-between overflow-y-auto max-h-full">
          
          {!bookingDone ? (
            <form onSubmit={handleBookInstant} className="space-y-5">
              <div className="border-b border-[#E8E4DA] pb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-stone-400 uppercase font-semibold">Valor da Noite</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold font-display text-[#2D362F] serif">R$ {property.pricePerNight}</span>
                    <span className="text-xs text-[#4A5D4E]/80">/noite</span>
                  </div>
                </div>
                <div className="mt-2.5 p-2 px-3 bg-[#E8E4DA]/20 rounded-xl border border-[#E8E4DA]/30 text-[11px] text-[#4A5D4E] leading-normal">
                  ✨ <strong>Instant Fastbook Ativo:</strong> Garantido pelo sistema integrado Brisa Nordeste. Tarifa protegida sem alteração na hora do fechamento.
                </div>
              </div>

              {/* Guest credentials form */}
              <div className="space-y-3.5">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#4A5D4E]/75 block">
                  Identificação do Viajante
                </h4>
                
                <div>
                  <label className="text-[11px] text-stone-500 font-medium block mb-1">Seu Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-[#4A5D4E]/50" />
                    <input 
                      type="text" 
                      value={guestName} 
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Ex: Adalberto Café"
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E8E4DA] bg-[#F8F6F2]/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] focus:border-[#4A5D4E]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-500 font-medium block mb-1">E-mail para Confirmação</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#4A5D4E]/50" />
                    <input 
                      type="email" 
                      value={guestEmail} 
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="seu@faturamento.com"
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E8E4DA] bg-[#F8F6F2]/30 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] focus:border-[#4A5D4E]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dates input */}
              <div className="space-y-3 pb-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#4A5D4E]/75 block">
                  Período da Hospedagem
                </h4>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] text-[#4A5D4E]/90 font-medium block mb-1">Check-In</label>
                    <input 
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={formattedTomorrow}
                      className="w-full text-xs p-2 rounded-xl border border-[#E8E4DA] bg-[#F8F6F2]/30 text-[#2D362F]/90 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#4A5D4E]/90 font-medium block mb-1">Check-Out</label>
                    <input 
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || formattedTomorrow}
                      className="w-full text-xs p-2 rounded-xl border border-[#E8E4DA] bg-[#F8F6F2]/30 text-[#2D362F]/90 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#4A5D4E]/90 font-medium block mb-1">Número de Hóspedes</label>
                  <select 
                    value={guestsCount} 
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DA] bg-[#F8F6F2]/30 text-[#2D362F]/90 focus:bg-white focus:outline-none"
                  >
                    {[...Array(property.maxGuests)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'hóspede' : 'hóspedes'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Breakdown cost */}
              {nights > 0 && (
                <div className="bg-[#F8F6F2] p-4 rounded-2xl border border-[#E8E4DA] space-y-2.5 text-xs card-shadow">
                  <div className="flex justify-between text-[#4A5D4E]/80">
                    <span>R$ {property.pricePerNight} x {nights} noites</span>
                    <span className="font-semibold text-[#2D362F]">R$ {pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[#4A5D4E]/80">
                    <span>Taxa de higienização</span>
                    <span className="font-semibold text-[#2D362F]">R$ {pricing.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between text-[#4A5D4E]/80">
                    <span>Seguro e taxa Brisa Nordeste</span>
                    <span className="font-semibold text-[#2D362F]">R$ {pricing.viviendaTax}</span>
                  </div>
                  <div className="border-t border-[#E8E4DA] pt-2.5 flex justify-between font-display text-base font-bold text-[#2D362F]">
                    <span>Total Estimado</span>
                    <span className="text-[#4A5D4E] font-bold">R$ {pricing.total}</span>
                  </div>
                </div>
              )}

              {errorText && (
                <p className="text-red-600 text-xs bg-red-50 p-2.5 rounded-xl border border-red-100 italic">
                  ⚠️ {errorText}
                </p>
              )}

              {/* CTA Booking */}
              <button 
                id="do-booking-btn"
                type="submit"
                disabled={isSubmitting || nights <= 0}
                className="w-full bg-[#4A5D4E] text-white font-semibold text-xs tracking-widest uppercase py-3.5 px-4 rounded-full hover:bg-[#344237] transition duration-300 disabled:opacity-50 shadow-md shadow-[#4A5D4E]/20"
              >
                {isSubmitting ? "Autenticando..." : "Confirmar e Pagar Agora"}
              </button>

              <p className="text-[10px] text-stone-400 text-center uppercase tracking-wider font-semibold">
                Você não será cobrado em ambiente real de produção.
              </p>
            </form>
          ) : (
            // Success State Screen
            <div className="py-2 flex flex-col items-center text-center space-y-5 h-full justify-center">
              <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
               </div>
              
              <div>
                <span className="text-stone-400 text-[10px] block uppercase font-bold tracking-widest">Reserva Aprovada</span>
                <h3 className="font-display font-medium text-xl text-[#2D362F] mt-1 serif text-2xl">Sua Estadia está Confirmada!</h3>
                <p className="text-xs text-stone-500 mt-2">
                  Uma confirmação instantânea segura foi enviada para o e-mail: <strong>{guestEmail}</strong>.
                </p>
              </div>

              {/* Ticket Voucher Visual */}
              <div className="w-full bg-[#F8F6F2] border border-dashed border-[#E8E4DA]/80 p-4 rounded-2xl relative text-left text-xs space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-[#4A5D4E] tracking-wider">
                  <span>Voucher de Viagem</span>
                  <span>#{bookingDone.id}</span>
                </div>
                <h4 className="font-medium text-[#2D362F] leading-tight serif text-lg">{property.title}</h4>
                <div className="grid grid-cols-2 gap-2 text-stone-600 text-[11px] pt-1.5 border-t border-[#E8E4DA]">
                  <div>
                    <span className="block text-[9px] uppercase font-semibold text-[#4A5D4E]/60">Check-In</span>
                    <strong className="text-[#2D362F]">{checkIn}</strong> (a partir das 14h)
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-semibold text-[#4A5D4E]/60">Check-Out</span>
                    <strong className="text-[#2D362F]">{checkOut}</strong> (até as 11h)
                  </div>
                </div>
                <div className="text-[11px] text-stone-750 bg-white p-2.5 rounded-lg border border-[#E8E4DA] italic">
                  📍 Código de entrada digital enviado para o bot.
                </div>
              </div>

              <div className="space-y-2 w-full pt-2">
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  O nosso Concierge Virtual está 100% à sua disposição para explicar o roteiro, temperatura da piscina, ou fornecer o código da fechadura.
                </p>
                <button 
                  id="start-chat-from-modal-btn"
                  onClick={() => {
                    // Trigger callback
                    onClose();
                  }}
                  className="w-full bg-[#2D362F] hover:bg-[#1f2621] text-white font-semibold text-xs tracking-widest uppercase py-3.5 rounded-full transition duration-300"
                >
                  Falar no Chat Concierge IA
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
