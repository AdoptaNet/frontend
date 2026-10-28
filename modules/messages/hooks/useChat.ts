'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { messagesService } from '../services/messages.service';
import type { ChatRoom, Message, SendMessagePayload } from '../models/message.types';

export function useChat(initialRoomId?: string | null) {
  const { user, accessToken } = useAuthStore();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    initialRoomId || null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [globalUnreadCount, setGlobalUnreadCount] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const activeRoomIdRef = useRef<string | null>(selectedRoomId);

  useEffect(() => {
    activeRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  // 1. Cargar lista de salas y contador global
  const loadRooms = useCallback(async () => {
    try {
      const [fetchedRooms, unreadData] = await Promise.all([
        messagesService.getMyRooms(),
        messagesService.getUnreadCount().catch(() => ({ unreadCount: 0 })),
      ]);
      setRooms(fetchedRooms);
      setGlobalUnreadCount(unreadData.unreadCount);

      // Si no hay sala seleccionada y hay salas, seleccionar la primera
      if (!activeRoomIdRef.current && fetchedRooms.length > 0) {
        setSelectedRoomId(fetchedRooms[0].id);
      }
    } catch (err) {
      console.error('Error al cargar salas de chat:', err);
    } finally {
      setIsLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    if (user && accessToken) {
      loadRooms();
    }
  }, [user, accessToken, loadRooms]);

  // 2. Conectar a WebSocket de Socket.IO
  useEffect(() => {
    if (!accessToken) return;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const baseUrl = apiUrl.replace(/\/$/, '');

    const socket = io(`${baseUrl}/messages`, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      if (activeRoomIdRef.current) {
        socket.emit('join_room', { roomId: activeRoomIdRef.current });
      }
    });

    // Nuevo mensaje recibido en tiempo real
    socket.on('new_message', (newMsg: Message) => {
      // Si el mensaje es para la sala actualmente abierta
      if (activeRoomIdRef.current === newMsg.chatRoomId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        // Si no lo envié yo, marcar como leído en servidor
        if (user && newMsg.senderId !== user.id) {
          messagesService
            .markAsRead(newMsg.chatRoomId)
            .catch(() => {});
        }
      }

      // Actualizar vista previa y contadores en la lista de salas
      setRooms((prevRooms) =>
        prevRooms.map((r) => {
          if (r.id === newMsg.chatRoomId) {
            const isCurrentActive =
              activeRoomIdRef.current === newMsg.chatRoomId;
            return {
              ...r,
              lastMessage: newMsg,
              lastMessageAt: newMsg.createdAt,
              unreadCount:
                isCurrentActive || newMsg.senderId === user?.id
                  ? r.unreadCount
                  : r.unreadCount + 1,
            };
          }
          return r;
        }),
      );
    });

    // Confirmación de lectura (Doble Check azul)
    socket.on(
      'messages_read',
      (data: { roomId: string; readByUserId: string }) => {
        if (activeRoomIdRef.current === data.roomId) {
          setMessages((prev) =>
            prev.map((m) =>
              m.senderId !== data.readByUserId && !m.readAt
                ? { ...m, readAt: new Date().toISOString() }
                : m,
            ),
          );
        }

        // Si fui yo quien leyó, poner unreadCount de esa sala a 0
        if (user && data.readByUserId === user.id) {
          setRooms((prev) =>
            prev.map((r) =>
              r.id === data.roomId ? { ...r, unreadCount: 0 } : r,
            ),
          );
          setGlobalUnreadCount((prev) => Math.max(0, prev - 1));
        }
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [accessToken, user]);

  // 3. Al cambiar de sala activa: unirse al socket room y cargar mensajes
  useEffect(() => {
    if (!selectedRoomId) return;

    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', { roomId: selectedRoomId });
    }

    let isCurrent = true;
    setIsLoadingMessages(true);

    messagesService
      .getRoomMessages(selectedRoomId, { limit: 50 })
      .then((msgs) => {
        if (isCurrent) {
          setMessages(msgs);
          // Marcar como leído
          messagesService.markAsRead(selectedRoomId).then(() => {
            setRooms((prev) =>
              prev.map((r) =>
                r.id === selectedRoomId ? { ...r, unreadCount: 0 } : r,
              ),
            );
            messagesService.getUnreadCount().then((res) => {
              setGlobalUnreadCount(res.unreadCount);
            });
          });
        }
      })
      .catch((err) => {
        console.error('Error al cargar mensajes:', err);
      })
      .finally(() => {
        if (isCurrent) setIsLoadingMessages(false);
      });

    return () => {
      isCurrent = false;
      if (socketRef.current?.connected) {
        socketRef.current.emit('leave_room', { roomId: selectedRoomId });
      }
    };
  }, [selectedRoomId]);

  // 4. Enviar mensaje
  const sendMessage = async (
    content?: string,
    file?: File | null,
  ): Promise<boolean> => {
    if (!selectedRoomId || isSending) return false;

    setIsSending(true);
    try {
      let attachmentUrl: string | undefined;
      let attachmentType: string | undefined;

      if (file) {
        const uploadRes = await messagesService.uploadChatImage(file);
        attachmentUrl = uploadRes.url;
        attachmentType = file.type;
      }

      const payload: SendMessagePayload = {
        content: content?.trim() || undefined,
        attachmentUrl,
        attachmentType,
      };

      const savedMessage = await messagesService.sendMessage(
        selectedRoomId,
        payload,
      );

      // Agregar optimistamente si el socket aún no lo hizo
      setMessages((prev) => {
        if (prev.some((m) => m.id === savedMessage.id)) return prev;
        return [...prev, savedMessage];
      });

      // Actualizar sala en la lista
      setRooms((prev) =>
        prev.map((r) =>
          r.id === selectedRoomId
            ? {
                ...r,
                lastMessage: savedMessage,
                lastMessageAt: savedMessage.createdAt,
              }
            : r,
        ),
      );

      return true;
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const selectedRoom =
    rooms.find((r) => r.id === selectedRoomId) || null;

  return {
    rooms,
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    messages,
    isLoadingRooms,
    isLoadingMessages,
    isSending,
    globalUnreadCount,
    sendMessage,
    refreshRooms: loadRooms,
  };
}
