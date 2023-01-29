import { CommunityMedia } from "./chat-room";

export interface User {
  userId: string;
  firebaseId: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
  isOnline:boolean
}

export interface ChatRoom {
  chatroomId: string;
  userOne: User;
  userTwo: User;
  chatRoomMessages: ChatRoomMessage[];
}

export interface ChatRoomMessage {
  messageId: string;
  user: User;
  chatroom: ChatRoom;
  content?: string;
  media?: CommunityMedia;
  isSeen:boolean
  type:'audio' | 'image' | 'video' | 'file' | 'call-video' | 'call-audio' | 'text' | 'removed' | 'icon'
  emoji?:string
}
