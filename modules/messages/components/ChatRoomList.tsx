'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, PawPrint, MessageSquare, Lock } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import type { ChatRoom } from '../models/message.types';
import { UserAvatar } from '@/shared/components/UserAvatar';

dayjs.extend(relativeTime);
dayjs.locale('es');

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  isLoading: boolean;
  currentUserId?: string;
}

export function ChatRoomList({
  rooms,
  selectedRoomId,
  onSelectRoom,
  isLoading,
  currentUserId,
}: ChatRoomListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter((r) => {
    const isAdopter = currentUserId === r.adopterId;
    const counterpartName = isAdopter
      ? r.shelter.fullName || 'Albergue'
      : r.adopter.fullName || 'Adoptante';
    const petName = r.pet.name;

    const term = searchTerm.toLowerCase();
    return (
      counterpartName.toLowerCase().includes(term) ||
      petName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col h-full border-r border-line bg-white">
      {/* Header con buscador */}
      <div className="p-3.5 border-b border-line">
        <h2 className="text-lg font-bold text-tinta-900 mb-2 flex items-center justify-between">
          <span>Mensajes</span>
          <span className="text-xs font-medium text-tinta-500 bg-superficie-2 px-2 py-0.5 rounded-full">
            {rooms.length} {rooms.length === 1 ? 'chat' : 'chats'}
          </span>
        </h2>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tinta-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por mascota o persona..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-superficie-1 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-verde-600 focus:border-verde-600 transition-colors"
          />
        </div>
      </div>

      {/* Lista de salas con scroll */}
      <div className="flex-1 overflow-y-auto divide-y divide-line/60">
        {isLoading ? (
          <div className="p-6 text-center text-xs text-tinta-400 animate-pulse">
            Cargando conversaciones...
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center text-tinta-400">
            <MessageSquare className="w-8 h-8 text-tinta-300 mb-2" />
            <p className="text-xs font-medium text-tinta-600">
              {searchTerm
                ? 'No se encontraron conversaciones con ese filtro.'
                : 'Aún no tienes conversaciones de adopción activas.'}
            </p>
            <p className="text-[11px] text-tinta-400 mt-1 max-w-[200px]">
              El chat se crea automáticamente cuando una postulación es evaluada o aprobada.
            </p>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const isSelected = room.id === selectedRoomId;
            const isAdopter = currentUserId === room.adopterId;
            const counterpart = isAdopter ? room.shelter : room.adopter;
            const counterpartRole = isAdopter ? 'Albergue' : 'Adoptante';
            const counterpartName =
              counterpart.fullName || counterpart.email.split('@')[0];

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onSelectRoom(room.id)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-verde-50/90 border-l-4 border-verde-700'
                    : 'hover:bg-superficie-1'
                }`}
              >
                {/* Avatar del interlocutor con fallback a mascota */}
                <div className="relative shrink-0">
                  {counterpart.avatarUrl ? (
                    <UserAvatar
                      src={counterpart.avatarUrl}
                      name={counterpartName}
                      sizeClassName="w-11 h-11"
                    />
                  ) : room.pet.primaryPhotoUrl ? (
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-line bg-verde-100 flex items-center justify-center">
                      <Image
                        src={room.pet.primaryPhotoUrl}
                        alt={room.pet.name}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <UserAvatar
                      name={counterpartName}
                      sizeClassName="w-11 h-11"
                    />
                  )}

                  {/* Badge de mascota si hay foto del animal y mostramos el avatar de usuario */}
                  {counterpart.avatarUrl && room.pet.primaryPhotoUrl && (
                    <div
                      title={`Mascota: ${room.pet.name}`}
                      className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full overflow-hidden border-2 border-white shadow-2xs"
                    >
                      <Image
                        src={room.pet.primaryPhotoUrl}
                        alt={room.pet.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {!room.isActive && (
                    <div
                      title="Conversación finalizada (Solo lectura)"
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-2xs"
                    >
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Contenido textual */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-tinta-900 truncate">
                      {counterpartName}
                    </span>
                    {room.lastMessageAt && (
                      <span className="text-[10px] text-tinta-400 shrink-0">
                        {dayjs(room.lastMessageAt).fromNow(true)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-semibold text-verde-700 bg-verde-100/60 px-1.5 py-0.2 rounded-xs truncate">
                      🐾 {room.pet.name}
                    </span>
                    <span className="text-[10px] text-tinta-400">
                      • {counterpartRole}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-tinta-600 truncate">
                      {room.lastMessage ? (
                        room.lastMessage.attachmentUrl ? (
                          <span className="italic text-verde-700 font-medium">
                            📷 [Fotografía adjunta]
                          </span>
                        ) : (
                          room.lastMessage.content
                        )
                      ) : (
                        <span className="italic text-tinta-400">
                          Conversación iniciada
                        </span>
                      )}
                    </p>

                    {room.unreadCount > 0 && (
                      <span className="shrink-0 bg-verde-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
