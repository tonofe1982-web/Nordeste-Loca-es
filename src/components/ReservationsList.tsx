/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Calendar, Ticket, MapPin, Users, MessageSquare, Key, ChevronRight, Clock, Download, CheckCircle, CreditCard, Sparkles } from "lucide-react";
import { Booking, Property } from "../types";

interface ReservationsListProps {
  bookings: Booking[];
  properties: Property[];
  onSelectPropertyForChat: (property: Property) => void;
  onRefresh: () => void;
}

export default function ReservationsList({ bookings, properties, onSelectPropertyForChat, onRefresh }: ReservationsListProps) {
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  const getDaysIntervalLabel = (checkInStr: string, checkOutStr: string) => {
    try {
      const inDate = new Date(checkInStr);
      const outDate = new Date(checkOutStr);
      const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
      return `${inDate.toLocaleDateString('pt-BR', opt)} - ${outDate.toLocaleDateString('pt-BR', opt)}, ${inDate.getFullYear()}`;
    } catch {
      return `${checkInStr} até ${checkOutStr}`;
    }
  };

  const handleDownloadStub = (b: Booking) => {
    // Generate simple metadata simulation alert
    alert(`[Brisa Nordeste Fastpass System]\n\nBaixando Bilhete de Acesso em PDF para: ${b.propertyTitle}\nAnfitrião Sincronizado: Helena/Roberto\nCódigo de Acesso: *7299#\n\nSalvamento simulado com êxito!`);
  };

  return (
    <div id="reservations-list-container" className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-medium text-[#2D362F] flex items-center space-x-2 serif text-2xl">
            <Ticket className="h-5 w-5 text-[#4A5D4E]" />
            <span>Minhas Reservas Ativas</span>
          </h2>
          <p className="text-stone-500 text-xs mt-0.5 font-light">Instantaneamente faturadas e garantidas por Brisa Nordeste Protection</p>
        </div>
        
        <button 
          id="sync-bookings-btn"
          onClick={onRefresh}
          className="text-xs font-semibold text-[#4A5D4E] bg-[#E8E4DA]/40 hover:bg-[#E8E4DA]/75 px-4 py-2 rounded-full transition flex items-center space-x-1 border border-[#E8E4DA]/60"
        >
          <span>Atualizar Painel</span>
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-3xl border border-[#E8E4DA] p-8 card-shadow">
          <Ticket className="h-12 w-12 text-[#4A5D4E]/30 mx-auto" />
          <h3 className="font-display font-medium text-[#2D362F] mt-3 text-sm serif text-base">Nenhuma hospedagem agendada</h3>
          <p className="text-stone-500 text-xs mt-1.5 max-w-sm mx-auto leading-normal font-light">
            Escolha uma das cabanas ou vilas de praia na nossa vitrine e aproveite o faturamento imediato para ativar seu assistente eletrônico!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const correspondingProperty = properties.find(p => p.id === booking.propertyId);
            const isTicketExpanded = activeTicketId === booking.id;
 
            return (
              <div 
                key={booking.id}
                id={`booking-card-${booking.id}`}
                className="bg-white rounded-3xl border border-[#E8E4DA] overflow-hidden card-shadow transition-all duration-300 flex flex-col justify-between"
              >
                {/* Horizontal Quick card */}
                <div className="p-5 flex gap-4">
                  <img 
                    src={booking.propertyImage} 
                    alt={booking.propertyTitle}
                    referrerPolicy="no-referrer"
                    className="h-20 w-24 rounded-2xl object-cover border border-[#E8E4DA] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] bg-[#4A5D4E]/10 text-[#4A5D4E] font-bold px-2 py-0.5 rounded-full border border-[#4A5D4E]/20 inline-block uppercase tracking-wider mb-1.5">
                      Confirmado Instante
                    </span>
                    <h3 className="font-display font-medium text-[#2D362F] text-sm truncate serif text-base">
                      {booking.propertyTitle}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#4A5D4E]/60" />
                      <span>{booking.propertyLocation}</span>
                    </p>
                  </div>
                </div>
 
                {/* Sub Metadata rows */}
                <div className="px-5 pb-4 border-b border-[#E8E4DA]/60 grid grid-cols-2 gap-4 text-xs text-stone-700">
                  <div className="bg-[#F8F6F2]/60 p-2.5 rounded-xl border border-[#E8E4DA]/50">
                    <span className="text-[9px] text-[#4A5D4E]/60 block uppercase font-bold tracking-widest leading-none mb-1">Período</span>
                    <p className="font-medium flex items-center gap-1.5 text-[11px] text-[#2D362F]">
                      <Calendar className="h-3.5 w-3.5 text-[#4A5D4E]/80 shrink-0" />
                      <span>{getDaysIntervalLabel(booking.checkIn, booking.checkOut)}</span>
                    </p>
                  </div>
                  <div className="bg-[#F8F6F2]/60 p-2.5 rounded-xl border border-[#E8E4DA]/50">
                    <span className="text-[9px] text-[#4A5D4E]/60 block uppercase font-bold tracking-widest leading-none mb-1">Passageiros</span>
                    <p className="font-medium flex items-center gap-1.5 text-[11px] text-[#2D362F]">
                      <Users className="h-3.5 w-3.5 text-[#4A5D4E]/80 shrink-0" />
                      <span>{booking.guestsCount} {booking.guestsCount === 1 ? 'Viajante' : 'Viajantes'}</span>
                    </p>
                  </div>
                </div>

                {/* Expanded Access digital panel */}
                {isTicketExpanded && correspondingProperty && (
                  <div className="bg-[#F8F6F2]/60 p-4 border-b border-[#E8E4DA] space-y-3">
                    <div className="text-xs text-[#2D362F] leading-normal bg-white p-3.5 rounded-xl border border-[#E8E4DA] card-shadow relative">
                      <div className="absolute right-3.5 top-3.5">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                      </div>
                      <span className="text-[9px] bg-[#E8E4DA] text-[#4A5D4E] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider block mb-1.5 w-max">
                        Guia Exclusivo Brisa Nordeste
                      </span>
                      <h4 className="font-medium text-[#2D362F] font-display mb-1 serif text-lg leading-tight">Fechadura Digital Ativa</h4>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        Seu anfitrião cadastrou as chaves no portal e disponibilizou as seguintes diretrizes para o seu acesso eletrônico:
                      </p>
                      <p className="italic text-stone-700 text-xs mt-2 bg-[#F8F6F2] p-2 rounded-lg border border-[#E8E4DA]/60">
                        "{correspondingProperty.checkInInstructions}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-stone-500 text-[11px]">Investimento Total: <strong>R$ {booking.totalPrice}</strong></span>
                      <button 
                        id={`download-stub-btn-${booking.id}`}
                        onClick={() => handleDownloadStub(booking)}
                        className="text-[#A47E5B] hover:text-[#4A5D4E] font-semibold flex items-center space-x-1 text-[11px] cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Baixar Fastpass PDF</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Interaction CTA row */}
                <div className="bg-[#F8F6F2] p-3 px-5 flex items-center justify-between gap-2 shrink-0">
                  <button 
                    id={`toggle-ticket-btn-${booking.id}`}
                    onClick={() => setActiveTicketId(isTicketExpanded ? null : booking.id)}
                    className="text-stone-700 hover:text-[#4A5D4E] font-semibold text-xs leading-none py-2 px-3.5 hover:bg-[#E8E4DA]/40 rounded-full transition"
                  >
                    {isTicketExpanded ? "Ocultar Guia de Entrada" : "Ver Código e Guia"}
                  </button>

                  <button 
                    id={`chat-concierge-action-${booking.id}`}
                    onClick={() => {
                      if (correspondingProperty) {
                        onSelectPropertyForChat(correspondingProperty);
                      }
                    }}
                    className="bg-[#4A5D4E] border border-[#4A5D4E] text-stone-50 font-semibold text-xs leading-none py-2 px-4 rounded-full hover:bg-[#344237] transition flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-[#4A5D4E]/10"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-[#D9B68A]" />
                    <span>Perguntar ao Concierge IA</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
