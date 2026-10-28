'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useChat } from '../hooks/useChat';
import { ChatRoomList } from './ChatRoomList';
import { ChatWindow } from './ChatWindow';
import { messagesService } from '../services/messages.service';

export function MessagesPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const initialRoomId = searchParams.get('room');
  const adoptionIdParam = searchParams.get('adoption');

  const {
    rooms,
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    messages,
    isLoadingRooms,
    isLoadingMessages,
    isSending,
    sendMessage,
    refreshRooms,
  } = useChat(initialRoomId);

  // Manejar query param ?adoption=...
  useEffect(() => {
    if (adoptionIdParam) {
      messagesService
        .getOrCreateByAdoption(adoptionIdParam)
        .then((room) => {
          setSelectedRoomId(room.id);
          refreshRooms();
        })
        .catch((err) => {
          console.error('Error al resolver sala por postulación:', err);
        });
    }
  }, [adoptionIdParam, setSelectedRoomId, refreshRooms]);

  // En móvil: vista de lista vs vista de conversación
  const [showMobileChat, setShowMobileChat] = useState<boolean>(
    Boolean(initialRoomId || adoptionIdParam),
  );

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6">
      <div className="bg-white border border-line rounded-2xl shadow-xs overflow-hidden h-[calc(100vh-8.5rem)] min-h-[500px] flex flex-col md:flex-row">
        {/* Columna Izquierda: Lista de Conversaciones */}
        <div
          className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
            showMobileChat ? 'hidden md:flex flex-col' : 'flex flex-col'
          }`}
        >
          <ChatRoomList
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
            isLoading={isLoadingRooms}
            currentUserId={user?.id}
          />
        </div>

        {/* Columna Derecha: Ventana de Chat */}
        <div
          className={`flex-1 h-full flex-col ${
            showMobileChat ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Barra de regreso en móvil */}
          {showMobileChat && (
            <div className="md:hidden bg-white border-b border-line px-3 py-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleBackToList}
                className="flex items-center gap-1 text-xs font-semibold text-verde-700 hover:text-verde-800 p-1 rounded-md cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver a mensajes</span>
              </button>
            </div>
          )}

          <ChatWindow
            room={selectedRoom}
            messages={messages}
            currentUserId={user?.id}
            isLoading={isLoadingMessages}
            isSending={isSending}
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
