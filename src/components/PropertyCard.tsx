/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Star, MapPin, Bed, Bath, Users, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  key?: string | number;
}

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const currentHighlightColor = () => {
    switch (property.platformHighlight.source) {
      case "Airbnb":
        return "bg-[#A47E5B]/5 border-[#A47E5B]/20 text-[#A47E5B]";
      case "Booking.com":
        return "bg-[#4A5D4E]/5 border-[#4A5D4E]/20 text-[#4A5D4E]";
      case "Vrbo":
        return "bg-[#F8F6F2] border-[#E8E4DA] text-[#2D362F]/80";
      case "Plum Guide":
        return "bg-[#D9B68A]/10 border-[#D9B68A]/30 text-[#A47E5B]";
      default:
        return "bg-[#F8F6F2] border-[#E8E4DA] text-[#4A5D4E]/70";
    }
  };

  const categoryLabel = () => {
    switch (property.category) {
      case "cabana": return "Cabana Alpina";
      case "praia": return "Refúgio de Praia";
      case "campo": return "Casarão de Campo";
      case "apartamento": return "Apartamento Design";
      case "villarural": return "Chácara & Lazer";
      default: return "Hospedagem";
    }
  };

  return (
    <div 
      id={`property-card-${property.id}`}
      className="group bg-white rounded-3xl border border-[#E8E4DA] overflow-hidden card-shadow transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
    >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F6F2]">
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.title} 
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Carousel buttons */}
        <button 
          id={`prev-img-${property.id}`}
          onClick={handlePrevImage}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 text-[#2D362F] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-xs focus:outline-none"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button 
          id={`next-img-${property.id}`}
          onClick={handleNextImage}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 text-[#2D362F] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-xs focus:outline-none"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
 
        {/* Carousel Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
          {property.images.map((_, index) => (
            <span 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
 
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-[#4A5D4E]/95 backdrop-blur-xs text-white font-semibold text-[10px] tracking-widest uppercase px-3 py-1 rounded">
          {categoryLabel()}
        </span>
      </div>
 
      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-[#4A5D4E]/80 mb-1.5">
            <div className="flex items-center space-x-1 text-sm font-medium">
              <MapPin className="h-4 w-4 text-[#4A5D4E]/50 shrink-0" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-[#D9B68A] fill-[#D9B68A]" />
              <span className="text-sm font-semibold text-[#2D362F]">{property.rating.toFixed(2)}</span>
            </div>
          </div>
 
          {/* Title */}
          <h3 className="serif text-2xl font-medium text-[#2D362F] line-clamp-1 group-hover:text-[#A47E5B] transition-colors duration-200 mt-1">
            {property.title}
          </h3>
 
          {/* Short Specs */}
          <div className="flex items-center space-x-3 text-[#4A5D4E]/75 text-xs mt-2 pb-3.5 border-b border-[#E8E4DA]">
            <span className="flex items-center space-x-1">
              <Users className="h-3.5 w-3.5" />
              <span>{property.maxGuests} Hóspedes</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Bed className="h-3.5 w-3.5" />
              <span>{property.bedrooms} Qts</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Bath className="h-3.5 w-3.5" />
              <span>{property.bathrooms} Banhs</span>
            </span>
          </div>
 
          {/* Platform Curation Advantage */}
          <div className={`mt-3.5 p-3 rounded-xl border text-xs flex items-start space-x-2 ${currentHighlightColor()}`}>
            <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block tracking-wide uppercase text-[10px]">
                Inovação Curada • Vantagem {property.platformHighlight.source}
              </span>
              <p className="mt-0.5 text-[#2D362F]/90 leading-relaxed font-normal">
                <strong>{property.platformHighlight.benefit}:</strong> {property.platformHighlight.description}
              </p>
            </div>
          </div>
        </div>
 
        {/* Pricing tag & CTA */}
        <div className="mt-5 flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-[#4A5D4E]/60 block font-medium">Tarifa por noite</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-bold font-display text-[#2D362F]">R$ {property.pricePerNight}</span>
              <span className="text-xs text-[#4A5D4ED]/60">/noite</span>
            </div>
          </div>
          <button 
            id={`view-details-btn-${property.id}`}
            onClick={() => onSelect(property)}
            className="bg-[#4A5D4E] hover:bg-[#344237] text-white font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full shadow-md shadow-[#4A5D4E]/10 transition-all duration-300"
          >
            Reservar Já
          </button>
        </div>
      </div>
    </div>
  );
}
