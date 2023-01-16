

//const severUrl = "http://localhost:4445/social/api";
  const severUrl = 'https://gentlevn.com/social/api'

//export const socketUrl = "http://localhost:4444/social/api";
 //export const socketUrl ='wss://gentlevn.com/social/api'

// export const socketLink ={
//   chats:{
//     path:"/finance/api/chat/socket.io",
//     link:`${socketUrl}/chat`
//   },
//   coins:{
//     path:"/finance/api/coins/socket.io",
//     link:`${socketUrl}/coins`
//   }
//  }

export const apiLink = {
  users: {
    signUp: `${severUrl}/users/signUp`,
    login: `${severUrl}/users/login`,
    checkAuth: `${severUrl}/users/checkAuth`,
    logout: `${severUrl}/users/logout`,
    findAll:`${severUrl}/users/findAll`

  },
  messages:{
    findAll:`${severUrl}/messages/findAll`
  },
  coins:{
    convertToUsdt:`${severUrl}/coins/convert-usd-to-usdt`,
    convertToUsd:`${severUrl}/coins/convert-usdt-to-usd`,
    buyCoins:`${severUrl}/coins/buy`,
    sellCoins:`${severUrl}/coins/sell`,
  }
};



