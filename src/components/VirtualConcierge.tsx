/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, MessageSquare, Bot, AlertCircle, RefreshCw, Key, HelpCircle, Utensils, Wifi, Waves } from "lucide-react";
import { Property, Message } from "../types";

interface VirtualConciergeProps {
  activeProperty: Property | null;
  guestName: string;
}

export default function VirtualConcierge({ activeProperty, guestName }: VirtualConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `Olá, ${guestName || "Adalberto"}! Seja muito bem-vindo à Brisa Nordeste. Eu sou o seu Concierge Virtual Pessoal, preparado para lhe oferecer suporte premium 24h e assessoria local para sua estadia.\n\nSua reserva para o **${activeProperty?.title || "Villa Quadrado Trancoso"}** já está sincronizada e ativa no meu sistema. Como posso tornar seu dia de hoje extraordinário?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Adjust greeting when active property switches
  useEffect(() => {
    if (activeProperty) {
      setMessages([
        {
          sender: "bot",
          text: `Perfeito, sincronizei minhas informações exclusivas para a propriedade **${activeProperty.title}** em *${activeProperty.location}*. \n\nPosso lhe instruir sobre códigos de checkout, temperatura do SPA, conexões Wi-Fi Starlink ou guias de trilha locais da nossa curadoria. Diga-me, o que você precisa no momento?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [activeProperty]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyInfo: activeProperty,
          chatHistory: messages.concat(userMsg),
          userMessage: textToSend,
          guestName: guestName
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao consultar assistente");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        sender: "bot",
        text: data.text || "Desculpe-me, tive um contratempo resolvendo seus dados. Poderia tentar perguntar novamente?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Estou tendo pequenos contratempos para alcançar o portal do condomínio no momento. Experimente reenviar sua requisição em instantes.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const speedPrompts = [
    { label: "Instruções de entrada", prompt: "Qual o código da fechadura eletrônica e como funciona o check-in?", icon: <Key className="h-3 w-3 inline text-[#4A5D4E]" /> },
    { label: "Conexão Wi-Fi estável?", prompt: "Qual a senha e estabilidade do Wi-Fi na propriedade?", icon: <Wifi className="h-3 w-3 inline text-[#4A5D4E]" /> },
    { label: "Aquecer SPA / Jacuzzi", prompt: "Como ligo e controlo a temperatura das banheiras ou jacuzzi?", icon: <Waves className="h-3 w-3 inline text-[#4A5D4E]" /> },
    { label: "Restaurantes locais", prompt: "Indique 3 ótimas opções de restaurantes sofisticados próximos do local.", icon: <Utensils className="h-3 w-3 inline text-[#4A5D4E]" /> },
  ];

  return (
    <div 
      id="virtual-concierge-panel"
      className="bg-white rounded-3xl border border-[#E8E4DA] overflow-hidden flex flex-col h-[580px] card-shadow"
    >
      
      {/* Butler Chat Header */}
      <div className="bg-[#4A5D4E] text-stone-50 p-4 px-6 flex items-center justify-between border-b border-[#344237] shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="h-10 w-10 bg-[#F8F6F2] rounded-full flex items-center justify-center border-2 border-[#D9B68A] shadow-sm relative">
              <Bot className="h-5.5 w-5.5 text-[#4A5D4E]" />
            </div>
            {/* Online pulsing indicator */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-505 border border-[#4A5D4E] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="font-display font-medium text-stone-100 leading-tight text-sm serif">Concierge Virtual Essência</h4>
              <span className="text-[9px] bg-white/20 text-[#D9B68A] font-bold px-1.5 py-0.5 rounded-md self-center uppercase tracking-wider">
                Elite AI
              </span>
            </div>
            <p className="text-[10px] text-stone-300 font-medium">Mordomo pessoal e suporte premium 24 horas</p>
          </div>
        </div>

        {/* Selected target cabin info tag */}
        {activeProperty && (
          <div className="text-right hidden sm:block">
            <span className="text-[9px] text-[#D9B68A] font-semibold uppercase block">Imóvel Ativo Sincronizado</span>
            <span className="text-stone-200 text-xs font-semibold leading-tight">{activeProperty.city}</span>
          </div>
        )}
      </div>

      {/* Target Info banner for users */}
      <div className="bg-[#F8F6F2] border-b border-[#E8E4DA] p-2.5 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2 text-[11px] text-stone-600">
          <Sparkles className="h-3.5 w-3.5 text-[#4A5D4E]/80" />
          <span>Focado no imóvel: <strong>{activeProperty?.title || "Selecione na lista para afunilar"}</strong></span>
        </div>
        <span className="text-[10px] bg-white border border-[#E8E4DA] text-[#4A5D4E] px-2 py-0.5 rounded-md font-semibold">
          Conexão Segura
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8F6F2]/40">
        
        {messages.map((msg, index) => {
          const isBot = msg.sender === "bot";
          return (
            <div 
              key={index}
              id={`message-bubble-${index}`}
              className={`flex items-start gap-3.5 ${isBot ? "" : "flex-row-reverse"}`}
            >
              {/* Profile Avatar inside chat */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isBot ? 'bg-[#4A5D4E]/10 text-[#4A5D4E] border border-[#4A5D4E]/20' : 'bg-[#E8E4DA] text-[#2D362F] font-semibold border border-[#E8E4DA]/60'}`}>
                {isBot ? <Bot className="h-4.5 w-4.5" /> : <span className="text-xs font-bold serif">U</span>}
              </div>

              {/* Message Bubble text wrapper */}
              <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-1 shadow-3xs border ${isBot ? 'bg-white border-[#E8E4DA] text-[#2D362F] rounded-tl-none' : 'bg-[#4A5D4E] border-[#4A5D4E] text-stone-50 rounded-tr-none'}`}>
                <div className="whitespace-pre-line font-light">
                  {msg.text}
                </div>
                <div className={`text-[9px] text-right mt-1.5 block ${isBot ? 'text-stone-400' : 'text-stone-300/80'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-[#4A5D4E]/10 text-[#4A5D4E] border border-[#4A5D4E]/20 flex items-center justify-center">
              <Bot className="h-4.5 w-4.5 animate-bounce" />
            </div>
            <div className="bg-white border border-[#E8E4DA] rounded-2xl rounded-tl-none p-4 shadow-3xs max-w-[85%]">
              <div className="flex space-x-1.5 items-center">
                <span className="h-2 w-2 rounded-full bg-[#4A5D4E]/50 animate-bounce delay-100" />
                <span className="h-2 w-2 rounded-full bg-[#4A5D4E]/50 animate-bounce delay-200" />
                <span className="h-2 w-2 rounded-full bg-[#4A5D4E]/50 animate-bounce delay-300" />
                <span className="text-[11px] text-stone-400 font-medium pl-1.5">O Concierge Virtual está prestando o seu auxílio de luxo...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested speed prompts selection bar */}
      <div className="p-3 bg-stone-50 border-t border-[#E8E4DA] overflow-x-auto whitespace-nowrap flex gap-2 shrink-0">
        {speedPrompts.map((p, i) => (
          <button
            key={i}
            id={`pref-prompt-${i}`}
            onClick={() => handleSuggestClick(p.prompt)}
            className="inline-flex items-center space-x-1 bg-white hover:bg-[#F8F6F2] hover:border-[#4A5D4E]/40 text-[#2D362F] hover:text-[#4A5D4E] text-[11px] font-medium px-3.5 py-1.5 rounded-full border border-[#E8E4DA] transition shrink-0 cursor-pointer card-shadow"
          >
            {p.icon}
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Input controls form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3.5 px-4 bg-white border-t border-[#E8E4DA] flex items-center gap-3 shrink-0"
      >
        <input 
          id="concierge-input-field"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Pergunte ao concierge sobre ${activeProperty ? activeProperty.city : 'sua estadia'}...`}
          className="flex-1 bg-[#F8F6F2]/40 hover:bg-[#F8F6F2]/75 rounded-full px-4 py-2.5 text-xs border border-[#E8E4DA] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] focus:border-[#4A5D4E]"
          disabled={isLoading}
        />
        <button 
          id="send-concierge-msg-btn"
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 rounded-full bg-[#4A5D4E] text-white hover:bg-[#344237] transition disabled:opacity-50 shrink-0 shadow-md shadow-[#4A5D4E]/15"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>

    </div>
  );
}
