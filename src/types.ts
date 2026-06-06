/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Amenity {
  name: string;
  category: "básica" | "premium" | "entretenimento" | "cozinha";
  icon: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  category: "cabana" | "praia" | "campo" | "villarural" | "apartamento";
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  images: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  hostName: string;
  hostAvatar: string;
  platformHighlight: {
    source: "Airbnb" | "Booking.com" | "Vrbo" | "Plum Guide";
    benefit: string;
    description: string;
  };
  amenities: Amenity[];
  reviews: Review[];
  checkInInstructions: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  bookedAt: string;
  guestName: string;
  guestEmail: string;
  status: "confirmado" | "em_andamento" | "concluido";
}

export interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
