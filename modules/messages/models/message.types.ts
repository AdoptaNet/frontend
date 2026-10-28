export interface ChatParticipant {
  id: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
}

export interface ChatPet {
  id: string;
  name: string;
  species: string;
  primaryPhotoUrl: string | null;
}

export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  sender?: ChatParticipant;
  content: string;
  attachmentUrl: string | null;
  attachmentType: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  adoptionRequestId: string;
  adopterId: string;
  adopter: ChatParticipant;
  shelterId: string;
  shelter: ChatParticipant;
  pet: ChatPet;
  adoptionStatus: string;
  isActive: boolean;
  lastMessageAt: string | null;
  unreadCount: number;
  lastMessage?: Message | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  content?: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
