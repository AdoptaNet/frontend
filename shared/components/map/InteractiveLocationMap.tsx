"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink, Hand } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface InteractiveLocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  onChange?: (coords: { latitude: number; longitude: number }) => void;
  readOnly?: boolean;
  shelterName?: string;
  className?: string;
  zoom?: number;
}

export function InteractiveLocationMap({
  latitude,
  longitude,
  onChange,
  readOnly = false,
  shelterName,
  className = "h-80 sm:h-[400px]",
  zoom = 15,
}: InteractiveLocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fallback coords: Lima, Peru
  const defaultLat = -12.0464;
  const defaultLng = -77.0428;

  const currentLat = latitude ?? defaultLat;
  const currentLng = longitude ?? defaultLng;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !containerRef.current) return;

      // Clean up previous instance if any
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }

      // Custom high-definition SVG pin in platform verde theme
      const customPinIcon = L.divIcon({
        className: "custom-leaflet-pin",
        html: `
          <div style="position: relative; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: ${
            readOnly ? "default" : "grab"
          };">
            <div style="background-color: #15803d; color: #ffffff; width: 38px; height: 38px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.2); border: 2.5px solid #ffffff;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div style="width: 10px; height: 10px; background-color: #15803d; transform: rotate(45deg); margin-top: -5px; border-bottom: 2px solid white; border-right: 2px solid white;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      // Initialize map instance
      const map = L.map(containerRef.current, {
        center: [currentLat, currentLng],
        zoom: zoom,
        scrollWheelZoom: false,
      });

      // OpenStreetMap standard tile layer (100% free, public, no API key required)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create draggable or static marker
      const marker = L.marker([currentLat, currentLng], {
        icon: customPinIcon,
        draggable: !readOnly,
      }).addTo(map);

      if (shelterName) {
        marker.bindPopup(
          `<div style="font-weight: 700; font-size: 13px; color: #111827; padding: 2px;">${shelterName}</div>`,
        );
      }

      if (!readOnly && onChange) {
        // Click on map to move marker and update coordinates
        map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
          const newLat = Number(e.latlng.lat.toFixed(6));
          const newLng = Number(e.latlng.lng.toFixed(6));
          marker.setLatLng([newLat, newLng]);
          onChange({ latitude: newLat, longitude: newLng });
        });

        // Drag marker to fine-tune exact location
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          const newLat = Number(pos.lat.toFixed(6));
          const newLng = Number(pos.lng.toFixed(6));
          onChange({ latitude: newLat, longitude: newLng });
        });
      }

      mapRef.current = map;
      markerRef.current = marker;

      // Ensure proper render size after mount
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isClient, readOnly]); // Only re-create map if readOnly changes

  // Update marker position and fly to coordinates if they change externally
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (typeof latitude !== "number" || typeof longitude !== "number") return;

    const currentPos = markerRef.current.getLatLng();
    const diffLat = Math.abs(currentPos.lat - latitude);
    const diffLng = Math.abs(currentPos.lng - longitude);

    if (diffLat > 0.0001 || diffLng > 0.0001) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.flyTo([latitude, longitude], mapRef.current.getZoom(), {
        animate: true,
        duration: 0.8,
      });
    }
  }, [latitude, longitude]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-line bg-superficie-2 shadow-xs ${className}`}
    >
      {/* Map DOM Container */}
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Interactive Helper Banner for Edit Mode (Top-Right, clear of the zoom controls at top-left) */}
      {!readOnly && (
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs text-tinta-700 border border-line shadow-xs flex items-center gap-1.5 z-10 pointer-events-none">
          <Hand className="w-3.5 h-3.5 text-verde-700" />
          <span>Haz clic o arrastra el pin para seleccionar tu ubicación</span>
        </div>
      )}

      {/* External Link to Google Maps */}
      <div className="absolute bottom-3 left-3 z-10">
        <a
          href={`https://www.google.com/maps?q=${currentLat},${currentLng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-tinta-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-line shadow-xs transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-verde-700" />
          <span>Abrir en Google Maps</span>
        </a>
      </div>
    </div>
  );
}
