import { DefaultResponse } from ".";
import { MediaDto } from "./chat";
import { ChatRoom, ChatRoomMessage, User } from "./db";

export interface ClientSendChatRoomMessageDto{
    content:string;
    haveChatRoom:boolean;
    receiverId:string;
    type:string
}

export interface ClientUpdateChatRoomMessageEmojiDto{
    emoji:string;
    receiver:User;
    message:ChatRoomMessage
}

export interface ClientDeleteChatRoomMessageDto{

    receiver:User;
    message:ChatRoomMessage
}

export interface ClientSendMediaChatRoomMessageDto{
    receiver:User;
    media:MediaDto
}




export interface GetChatRoomResponse extends DefaultResponse{
    receiver?:User
    messageList?:ChatRoomMessage[]
}

export interface GetAllChatRoomResponse extends DefaultResponse{
    chatRooms?:ChatRoom[]
}

export interface CommunityMedia {
    mediaId:string
    key:string
    mimeType:string
    size:number
    location:string
    createdAt:Date
}
