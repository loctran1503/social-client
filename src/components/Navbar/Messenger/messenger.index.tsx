import { faComment, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import MediaQuery from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../../storing/hook";
import { authSelector } from "../../../storing/reducers/authSlice";
import {
  localSelector,
  setChatRoomSocket
} from "../../../storing/reducers/localSlice";
import { ChatRoom, ChatRoomMessage } from "../../../types/db";
import { getAllChatRoomApi } from "../../../utils/api/chat-room";
import { socketLink } from "../../../utils/api/link";
import styles from "./styles.module.scss";
const Messenger = () => {
  const { isAuthenticated, isLoading, accessToken, user } =
    useAppSelector(authSelector);
  const { chatRoomSocket } = useAppSelector(localSelector);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [counting,setCounting] = useState(0)
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);
  const openModal = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  const closeModal = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const navigate = useNavigate();
  const location = useLocation()
  const handleNavigate = async (userId: string) => {
    
    navigate(`/chat-room/${userId}`);
    closeModal()
    setCounting(0)

    if(chatRoomList.length>0){
      const temp = chatRoomList.map(item => {
        item.chatRoomMessages[0].isSeen=true
        return item
      })
      setChatRoomList(temp)
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const socket = io(socketLink.chatRoom.link, {
        transports: ["websocket"],
        path: socketLink.chatRoom.path,
        auth: {
          token: accessToken as string,
        },
      });
      socket.on("connect", () => {
        dispatch(setChatRoomSocket(socket));
      });

      socket.on("connect_error", (err: any) => console.log(err));
      socket.on("connect_failed", (err: any) => console.log(err));

      const getAllChatRoom = async () => {
        const result = await getAllChatRoomApi();

        if (result.success && result.chatRooms) {
          result.chatRooms.forEach(item =>{
            if(!item.chatRoomMessages[0].isSeen){
              setCounting(prev => prev+1)
            }
          })
          setChatRoomList(result.chatRooms);
        }
      };
      getAllChatRoom();
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (chatRoomSocket) {
      chatRoomSocket.on("server-send-message", (data: ChatRoomMessage) => {
     
        if (chatRoomList.length > 0) {
          const temp: ChatRoom[] = chatRoomList.map((item) => {
            if (item.chatroomId === data.chatroom.chatroomId) {
              item.chatRoomMessages[0] = data;
            }
            return item;
          });
          if(!location.pathname.includes("chat-room")){
            setCounting(prev => prev+1)
          }

          setChatRoomList(temp);
        }
      });
      chatRoomSocket.on("server-send-media", (data) => {
        if (chatRoomList.length > 0) {
          const temp: ChatRoom[] = chatRoomList.map((item) => {
            if (item.chatroomId === data.newMessage.chatroom.chatroomId) {
              item.chatRoomMessages[0] = data.newMessage;
            }
            return item;
          });
       
          if(!location.pathname.includes("chat-room")){
            setCounting(prev => prev+1)
          }
          setChatRoomList(temp);
        }
      });
      chatRoomSocket.on("server-send-call-video-stop", (data) => {
      
        const newMessage : ChatRoomMessage = data.newMessage;
        if (newMessage) {
          const temp: ChatRoom[] = chatRoomList.map((item) => {
            if (item.chatroomId === newMessage.chatroom.chatroomId) {
              item.chatRoomMessages[0] = newMessage;
            }
            return item;
          });
          if(!location.pathname.includes("chat-room")){
            setCounting(prev => prev+1)
          }
          setChatRoomList(temp);
        }
      });
    }
  }, [chatRoomSocket,location]);

  


  return (
    <div>
      <MediaQuery minWidth={769}></MediaQuery>
      <div className={styles.messengerIconContainer}>
      <FontAwesomeIcon
        icon={faComment}
        className="mobileBottomIcon"
        onClick={openModal}
      />
      {counting>0 && <span className={styles.messageSeenCounting}>{counting}</span>}
      </div>
      {isOpen && (
        <>
          {/* Desktop and tablet________________________________________________________________________ */}
          <MediaQuery minWidth={769}>
            <div className={styles.container}>
              <div className={styles.header}>
                <p></p>
                <p>Messenger</p>
                <FontAwesomeIcon
                  icon={faXmark}
                  className={styles.closeIcon}
                  onClick={closeModal}
                />
              </div>
              <div className={styles.body}>
                {chatRoomList.length > 0 &&
                  chatRoomList.map((item) => {
                    let avatar: string = "";
                    let username: string = "";
                    let userId: string = "";
                    if (item.userOne.userId === user?.userId) {
                      avatar = item.userTwo.avatar;
                      username = item.userTwo.name;
                      userId = item.userTwo.userId;
                    }
                    if (item.userTwo.userId === user?.userId) {
                      avatar = item.userOne.avatar;
                      username = item.userOne.name;
                      userId = item.userOne.userId;
                    }
                    const message = item.chatRoomMessages[0];
                    let content: string = "";
                    switch (message.type) {
                      case "text": {
                        content = message.content || "";
                        break;
                      }
                      case "image": {
                        content = "Hình ảnh";
                        break;
                      }
                      case "icon": {
                        content = "Icon";
                        break;
                      }
                      case "call-video": {
                        content = "Đoạn chat video";
                        break;
                      }

                      default:
                        break;
                    }
                    return (
                      <div
                        className={styles.chatroomItem}
                        onClick={() => handleNavigate(userId)}
                        key={item.chatroomId}
                      >
                        <img src={avatar} alt="" />
                        <div className={styles.userNameAndLastMessage}>
                          <h4>{username}</h4>
                          <p className={clsx(!message.isSeen && styles.isSeen)}>
                            {content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </MediaQuery>
          {/* Mobile________________________________________________________________________ */}
          <MediaQuery maxWidth={768}>
            <div className={styles.mobileContainer}>
              <div className={styles.header}>
                <p></p>
                <p>Messenger</p>
                <FontAwesomeIcon
                  icon={faXmark}
                  className={styles.closeIcon}
                  onClick={closeModal}
                />
              </div>
              <div className={styles.body}>
                {chatRoomList.length > 0 &&
                  chatRoomList.map((item) => {
                    let avatar: string = "";
                    let username: string = "";
                    let userId: string = "";
                    if (item.userOne.userId === user?.userId) {
                      avatar = item.userTwo.avatar;
                      username = item.userTwo.name;
                      userId = item.userTwo.userId;
                    }
                    if (item.userTwo.userId === user?.userId) {
                      avatar = item.userOne.avatar;
                      username = item.userOne.name;
                      userId = item.userOne.userId;
                    }
                    return (
                      <div
                        className={styles.chatroomItem}
                        key={item.chatroomId}
                        onClick={() => handleNavigate(userId)}
                      >
                        <img src={avatar} alt="" />
                        <div className={styles.userNameAndLastMessage}>
                          <h4>{username}</h4>
                          <p>{item.chatRoomMessages[0].content}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </MediaQuery>
        </>
      )}
    </div>
  );
};

export default React.memo(Messenger);
