import { httpClient } from '@/shared/services/http-client';
import { API_ROUTES } from '@/shared/config/api-routes';
import type {
  ChatRoom,
  Message,
  SendMessagePayload,
  UnreadCountResponse,
} from '../models/message.types';

export const messagesService = {
  async getMyRooms(): Promise<ChatRoom[]> {
    return httpClient.get<ChatRoom[]>(API_ROUTES.MESSAGES.ROOMS);
  },

  async getRoomById(id: string): Promise<ChatRoom> {
    return httpClient.get<ChatRoom>(API_ROUTES.MESSAGES.BY_ID(id));
  },

  async getOrCreateByAdoption(adoptionId: string): Promise<ChatRoom> {
    return httpClient.get<ChatRoom>(API_ROUTES.MESSAGES.BY_ADOPTION(adoptionId));
  },

  async getRoomMessages(
    roomId: string,
    params?: { limit?: number; before?: string },
  ): Promise<Message[]> {
    return httpClient.get<Message[]>(API_ROUTES.MESSAGES.MESSAGES(roomId), {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  async sendMessage(
    roomId: string,
    payload: SendMessagePayload,
  ): Promise<Message> {
    return httpClient.post<Message>(
      API_ROUTES.MESSAGES.MESSAGES(roomId),
      payload,
    );
  },

  async markAsRead(roomId: string): Promise<{ affected: number }> {
    return httpClient.patch<{ affected: number }>(
      API_ROUTES.MESSAGES.READ(roomId),
      {},
    );
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return httpClient.get<UnreadCountResponse>(
      API_ROUTES.MESSAGES.UNREAD_COUNT,
    );
  },

  async uploadChatImage(file: File): Promise<{ url: string; key: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post<{ url: string; key: string }>(
      API_ROUTES.MEDIA.UPLOAD,
      formData,
    );
  },
};
