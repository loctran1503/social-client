

//const severUrl = "http://localhost:4445/social/api";
  const severUrl = 'https://gentlevn.com/social/api'

//export const socketUrl = "http://localhost:4445/social/api";
 export const socketUrl ='wss://gentlevn.com/social/api'

export const socketLink ={
  chats:{
    path:"/social/api/chat/socket.io",
    link:`${socketUrl}/chat`
  },
  chatRoom:{
    path:"/social/api/chat-room/socket.io",
    link:`${socketUrl}/chat-room`
  }
 
 }

export const apiLink = {
  users: {
    signUp: `${severUrl}/users/signUp`,
    login: `${severUrl}/users/login`,
    checkAuth: `${severUrl}/users/checkAuth`,
    logout: `${severUrl}/users/logout`,
    getAllUser:`${severUrl}/users/get-all-user`,
    
  },
  messages:{
    findAll:`${severUrl}/users/findAllCommunityMessage`
  },
  chatsRoom:{
    getOne:`${severUrl}/chat-room/get-one`,
    getAll:`${severUrl}/chat-room/get-all`,
    setIsSeen:`${severUrl}/chat-room/is-seen`
  }
};



