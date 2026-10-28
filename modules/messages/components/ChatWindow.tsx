'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Send,
  Paperclip,
  CheckCheck,
  Check,
  Lock,
  PawPrint,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import dayjs from 'dayjs';
import type { ChatRoom, Message } from '../models/message.types';
import { ImageLightboxModal } from './ImageLightboxModal';
import { UserAvatar } from '@/shared/components/UserAvatar';

interface ChatWindowProps {
  room: ChatRoom | null;
  messages: Message[];
  currentUserId?: string;
  isLoading: boolean;
  isSending: boolean;
  onSendMessage: (content?: string, file?: File | null) => Promise<boolean>;
}

export function ChatWindow({
  room,
  messages,
  currentUserId,
  isLoading,
  isSending,
  onSendMessage,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Manejar preview de imagen local
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('La imagen no debe superar los 5 MB.');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !selectedFile) || isSending || !room?.isActive) {
      return;
    }

    try {
      setErrorMessage(null);
      await onSendMessage(inputText, selectedFile);
      setInputText('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Error al enviar el mensaje. Inténtalo nuevamente.',
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-superficie-1/50 p-8 text-center text-tinta-400">
        <PawPrint className="w-12 h-12 text-tinta-300 mb-3" />
        <h3 className="text-base font-bold text-tinta-700">
          Selecciona una conversación
        </h3>
        <p className="text-xs text-tinta-500 max-w-sm mt-1">
          Elige un chat de la lista izquierda para visualizar el historial y comunicarte en tiempo real.
        </p>
      </div>
    );
  }

  const isAdopter = currentUserId === room.adopterId;
  const counterpart = isAdopter ? room.shelter : room.adopter;
  const counterpartRole = isAdopter ? 'Albergue / Custodio' : 'Adoptante';
  const counterpartName =
    counterpart.fullName || counterpart.email.split('@')[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8faf9] relative">
      {/* Header del Chat */}
      <div className="px-4 py-3 bg-white border-b border-line flex items-center justify-between shadow-2xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar
            src={counterpart.avatarUrl}
            name={counterpartName}
            sizeClassName="w-10 h-10"
          />

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-tinta-900 truncate flex items-center gap-2">
              <span>{counterpartName}</span>
              <span className="text-[10px] font-normal text-tinta-500 bg-superficie-2 px-1.5 py-0.2 rounded-xs">
                {counterpartRole}
              </span>
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-tinta-500">
              <Link
                href={`/pets/${room.pet.id}`}
                target="_blank"
                className="text-verde-700 hover:text-verde-800 font-medium flex items-center gap-1 hover:underline truncate"
              >
                <span>Mascota: {room.pet.name}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* Indicador de estado */}
        <div className="shrink-0 flex items-center gap-1.5">
          {room.isActive ? (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-verde-700 bg-verde-50 px-2.5 py-1 rounded-full border border-verde-200">
              <span className="w-2 h-2 rounded-full bg-verde-500 animate-pulse" />
              Canal activo
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-tinta-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-300">
              <Lock className="w-3 h-3 text-tinta-500" />
              Solo lectura
            </span>
          )}
        </div>
      </div>

      {/* Visor de Mensajes con scroll */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-verde-700" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-tinta-400">
            <PawPrint className="w-8 h-8 text-tinta-300 mb-2" />
            <p className="text-xs font-semibold text-tinta-700">
              Inicia la conversación
            </p>
            <p className="text-[11px] text-tinta-500 max-w-xs mt-1">
              Pueden coordinar fechas de visita, preguntas sobre el hogar y compartir evidencias de adaptación.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMine ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs break-words ${
                    isMine
                      ? 'bg-verde-700 text-white rounded-br-xs'
                      : 'bg-white text-tinta-900 border border-line rounded-bl-xs'
                  }`}
                >
                  {/* Foto adjunta si existe */}
                  {msg.attachmentUrl && (
                    <div className="mb-2 overflow-hidden rounded-lg cursor-pointer group relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={msg.attachmentUrl}
                        alt="Adjunto en chat"
                        onClick={() => setLightboxImageUrl(msg.attachmentUrl)}
                        className="max-h-60 w-auto rounded-lg object-cover transition-transform group-hover:scale-102"
                      />
                      <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Ampliar
                      </span>
                    </div>
                  )}

                  {/* Texto del mensaje */}
                  {msg.content && (
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}

                  {/* Hora y Doble Check */}
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isMine ? 'text-verde-100' : 'text-tinta-400'
                    }`}
                  >
                    <span>{dayjs(msg.createdAt).format('HH:mm')}</span>
                    {isMine && (
                      <span>
                        {msg.readAt ? (
                          <span title={`Leído a las ${dayjs(msg.readAt).format('HH:mm')}`}>
                            <CheckCheck className="w-3.5 h-3.5 text-sky-300 inline" />
                          </span>
                        ) : (
                          <span title="Entregado">
                            <Check className="w-3 h-3 text-white/70 inline" />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Alerta de error si ocurre */}
      {errorMessage && (
        <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-xs text-rose-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input bar o Banner de sala congelada */}
      {!room.isActive ? (
        <div className="bg-amber-50/90 border-t border-amber-200 p-3.5 text-center text-xs text-amber-900 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 shrink-0 text-amber-700" />
          <span className="font-medium">
            Esta conversación ha finalizado porque la postulación de adopción ha sido concluida. El chat se encuentra en modo solo lectura para auditoría.
          </span>
        </div>
      ) : (
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-line"
        >
          {/* Preview de imagen seleccionada */}
          {previewUrl && (
            <div className="mb-2 flex items-center gap-2 p-1.5 bg-superficie-1 rounded-lg border border-line w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Previsualización adjunto"
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="text-xs">
                <p className="font-semibold text-tinta-800 truncate max-w-[150px]">
                  {selectedFile?.name}
                </p>
                <p className="text-[10px] text-tinta-400">
                  {((selectedFile?.size || 0) / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1 text-tinta-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Botón para adjuntar foto */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar evidencia fotográfica (máx 5MB)"
              className="p-2 text-tinta-500 hover:text-verde-700 hover:bg-verde-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Input de texto */}
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje... (Shift+Enter para salto de línea)"
                rows={1}
                maxLength={1000}
                className="w-full resize-none max-h-32 min-h-[40px] px-3.5 py-2 text-xs bg-superficie-1 border border-line rounded-xl focus:outline-none focus:ring-1 focus:ring-verde-600 focus:border-verde-600 text-tinta-900 placeholder:text-tinta-400"
              />
              <span className="absolute right-2.5 bottom-1 text-[9px] text-tinta-400">
                {inputText.length}/1000
              </span>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={
                (!inputText.trim() && !selectedFile) || isSending
              }
              className="p-2.5 bg-verde-700 hover:bg-verde-800 disabled:opacity-50 disabled:hover:bg-verde-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      )}

      {/* Lightbox para fotos */}
      <ImageLightboxModal
        imageUrl={lightboxImageUrl}
        onClose={() => setLightboxImageUrl(null)}
      />
    </div>
  );
}
