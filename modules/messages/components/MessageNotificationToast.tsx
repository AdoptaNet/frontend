'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { UserAvatar } from '@/shared/components/UserAvatar';
import type { Message } from '../models/message.types';

interface ToastData {
  id: string;
  roomId: string;
  message: Message;
}

interface MessageNotificationToastProps {
  onUnreadIncrement?: () => void;
}

export function MessageNotificationToast({
  onUnreadIncrement,
}: MessageNotificationToastProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const { user, accessToken } = useAuthStore();
  const [toast, setToast] = useState<ToastData | null>(null);

  // Mantener actualizado el pathname y cerrar inmediatamente cualquier toast si entra a /messages
  useEffect(() => {
    pathnameRef.current = pathname;
    if (pathname === '/messages' || pathname.startsWith('/messages')) {
      setToast(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (!accessToken || !user) return;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const baseUrl = apiUrl.replace(/\/$/, '');

    const socket = io(`${baseUrl}/messages`, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on(
      'unread_message_notification',
      (data: { roomId: string; message: Message }) => {
        // Regla estricta: Jamás mostrar toast si el usuario está en la ruta /messages
        const currentPath = pathnameRef.current || '';
        if (currentPath === '/messages' || currentPath.startsWith('/messages')) {
          return;
        }

        if (onUnreadIncrement) {
          onUnreadIncrement();
        }

        // Mostrar Toast flotante
        setToast({
          id: data.message.id,
          roomId: data.roomId,
          message: data.message,
        });
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [accessToken, user, onUnreadIncrement]);

  // Auto-descartar después de 6 segundos
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast || pathname === '/messages' || pathname.startsWith('/messages')) {
    return null;
  }

  const sender = toast.message.sender;
  const senderName = sender?.fullName || sender?.email || 'Nuevo mensaje';
  const preview =
    toast.message.attachmentUrl && !toast.message.content
      ? '📷 [Fotografía adjunta]'
      : toast.message.content;

  const handleOpenChat = () => {
    setToast(null);
    router.push(`/messages?room=${toast.roomId}`);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-white border border-verde-200 rounded-2xl shadow-xl shadow-verde-900/10 p-3.5 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      <div className="flex items-start gap-3">
        {/* Avatar del remitente compatible con Google Photos y fallbacks */}
        <UserAvatar
          src={sender?.avatarUrl}
          name={senderName}
          sizeClassName="w-10 h-10"
        />

        {/* Contenido del Toast */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-xs font-bold text-tinta-900 truncate">
              {senderName}
            </span>
            <span className="text-[10px] text-tinta-400 shrink-0">Ahora</span>
          </div>

          <p className="text-xs text-tinta-600 line-clamp-2 leading-snug mb-2">
            {preview}
          </p>

          <button
            type="button"
            onClick={handleOpenChat}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-verde-700 hover:text-verde-800 bg-verde-50 hover:bg-verde-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <span>Ver mensaje</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Botón cerrar */}
        <button
          type="button"
          onClick={() => setToast(null)}
          aria-label="Cerrar notificación"
          className="text-tinta-400 hover:text-tinta-600 p-1 rounded-md hover:bg-superficie-2 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
