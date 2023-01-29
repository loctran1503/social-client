import {
  faChevronLeft,
  faFaceSmile,
  faImage,
  faMicrophone,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.scss";

import { useAppSelector } from "../../../../storing/hook";
import { authSelector } from "../../../../storing/reducers/authSlice";
import { localSelector } from "../../../../storing/reducers/localSlice";
import {
  ClientDeleteChatRoomMessageDto,
  ClientSendChatRoomMessageDto,
  ClientSendMediaChatRoomMessageDto,
  ClientUpdateChatRoomMessageEmojiDto,
} from "../../../../types/chat-room";
import { ChatRoomMessage, User } from "../../../../types/db";
import { getChatRoomApi, setIsSeenApi } from "../../../../utils/api/chat-room";
import InfiniteScroll from "react-infinite-scroll-component";
import CallAudio from "./CallAudio/call-audio.index";
import CallVideo from "./CallVideo/call-video.index";
import { assets, LIMIT_SIZE_FOR_UPLOAD } from "../../../../utils/constants";
import love from "../../../../assets/love.png";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
const ChatRoom = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { chatRoomSocket } = useAppSelector(localSelector);
  const { isLoading, isAuthenticated, user } = useAppSelector(authSelector);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<ChatRoomMessage[]>([]);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [displayEmojiPosition, setDisplayEmojiPosition] = useState<
    string | null
  >(null);
  const [displayRemoveMessageController, setDisplayRemoveMessageController] =
    useState<string | null>(null);

  const [isCallVideoOpen, setIsCallVideoOpen] = useState(false);
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
  })
  

  useEffect(() => {
    if (userId && !isLoading && isAuthenticated) {
      const getChatRoom = async () => {
   
        const result = await getChatRoomApi(userId);
        
        if (!result.success && !result.receiver) {
          navigate("/");
        } else {
          setReceiver(result.receiver!);
          await setIsSeenApi(result.receiver!)
        }
        if (result.messageList) {
          setMessageList(result.messageList);
        }
      };
      getChatRoom();
    }
  }, [isLoading, isAuthenticated]);
  useEffect(() => {
    if (chatRoomSocket) {
      //check user isOnline
      chatRoomSocket.on('server-boardcast-user-logout',(data) =>{
        console.log('server-boardcast-user-logout',data);
        
      })
      // Send text message
      chatRoomSocket.on("server-send-message", (data: ChatRoomMessage) => {
        if (data) {
          setMessageList((prevState) => [data, ...prevState]);
        }
      });
      //update message emoji
      chatRoomSocket.on(
        "server-update-chatroom-message-emoji",
        ({ updatedMessage }: { updatedMessage: ChatRoomMessage }) => {
          if (messageList && updatedMessage && updatedMessage.emoji) {
            const temp = messageList.map((item) => {
              if (item.messageId === updatedMessage.messageId) {
                item.emoji = updatedMessage.emoji;
              }
              return item;
            });
            setMessageList(temp);
          }
        }
      );

      //delete message
      chatRoomSocket.on(
        "server-remove-chatroom-message",
        ({ updatedMessage }: { updatedMessage: ChatRoomMessage }) => {
          if (messageList && updatedMessage) {
            const temp = messageList.map((item) => {
              if (item.messageId === updatedMessage.messageId) {
                item = updatedMessage;
              }
              return item;
            });
            setMessageList(temp);
          }
        }
      );
      //send media
      chatRoomSocket.on(
        "server-send-media",
        ({ newMessage }: { newMessage: ChatRoomMessage }) => {
          if (newMessage && messageList) {
            setMessageList((prevState) => [newMessage, ...prevState]);
          }
        }
      );
      //stop call video
      if (chatRoomSocket) {
        chatRoomSocket.on("server-send-call-video-stop", (data) => {
          if(user?.userId===data.receiver.userId){
            window.location.reload()
          }
          onCallVideoClose();
          const newMessage : ChatRoomMessage = data.newMessage;
          if (newMessage && messageList) {
            setMessageList((prevState) => [newMessage, ...prevState]);
          }
        });
      }
    }

    return () => {
      chatRoomSocket?.off("server-send-message");
      chatRoomSocket?.off("server-update-chatroom-message-emoji");
      chatRoomSocket?.off("server-remove-chatroom-message");
      chatRoomSocket?.off("server-send-media");
      chatRoomSocket?.off("server-send-call-video-stop");
    };
  }, [chatRoomSocket, messageList]);

  const onCallVideoClose = () => {
    setIsCallVideoOpen(false);
  };

  const handleSendMessage = () => {
    if (message.trim().length > 1 && chatRoomSocket && receiver) {
      const dto: ClientSendChatRoomMessageDto = {
        haveChatRoom: messageList.length > 0,
        content: message,
        receiverId: receiver.userId,
        type: "text",
      };

      chatRoomSocket.emit("client-send-message", { dto });
      setMessage("");
    } else {
      alert("input invalid");
    }
  };

  const handleUpdateMessageEmoji = (
    message: ChatRoomMessage,
    emoji: string
  ) => {
    if (receiver && chatRoomSocket) {
      setDisplayEmojiPosition(null);
      const dto: ClientUpdateChatRoomMessageEmojiDto = {
        receiver,
        emoji,
        message,
      };
      chatRoomSocket.emit("client-update-chatroom-message-emoji", {
        dto,
      });
    }
  };

  // Remove____________________________________________________________
  const handleRemoveMessage = (message: ChatRoomMessage) => {
    if (receiver && chatRoomSocket) {
      setDisplayRemoveMessageController(null);

      const dto: ClientDeleteChatRoomMessageDto = {
        receiver,
        message,
      };
      chatRoomSocket.emit("client-remove-chatroom-message", {
        dto,
      });
    }
  };

  // Upload Image__________________________________________________________
  const handleSendMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];

      if (file.size >= LIMIT_SIZE_FOR_UPLOAD) {
        alert("you cannot upload file more than 100MB");
        return;
      }

      if (receiver) {
        const dto: ClientSendMediaChatRoomMessageDto = {
          receiver,
          media: {
            buffer: file,
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
          },
        };
        if (chatRoomSocket) {
          chatRoomSocket.emit("client-send-media", {
            dto,
          });
        }
      }
    }
  };

  const handleSendIcon = (icon: string) => {
    if (chatRoomSocket && receiver) {
      const dto: ClientSendChatRoomMessageDto = {
        haveChatRoom: messageList.length > 0,
        content: icon,
        receiverId: receiver.userId,
        type: "icon",
      };
      chatRoomSocket.emit("client-send-message", { dto });
      if (displayEmojiPosition) {
        setDisplayEmojiPosition(null);
      }
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleRemoveDisplayEmojiPosition = () => {
    setDisplayEmojiPosition(null);
  };

  const handleRemoveDisplayRemoveMessageController = () => {
    setDisplayRemoveMessageController(null);
  };

  const fetchMoreData = () => {};
  return (
    <div>
      <div className="grid wide">
        <div className="row">
          <div className="col l-6 l-o-3 m-12 c-12">
            {receiver && (
              <div className={clsx(styles.container)}>
                <div className={styles.header}>
                  <div className={styles.receiverInfo}>
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className={styles.backIcon}
                      onClick={() => navigate("/")}
                    />
                    <div className={styles.avatarContainer}>
                    <img src={receiver.avatar} />
                    <span className={clsx(styles.userStatus,receiver.isOnline ? styles.online : styles.offline)}></span>
                    </div>
                    <h3>{receiver.name}</h3>
                  </div>
                  <div className={styles.callContainer}>
                    {/* <CallAudio /> */}
                    <FontAwesomeIcon
                      icon={faVideo}
                      className={styles.callVideoIcon}
                      onClick={() => setIsCallVideoOpen(true)}
                    />
                    {isCallVideoOpen && (
                      <CallVideo
                        onClose={onCallVideoClose}
                        sender={user}
                        receiver={receiver}
                        type="call"
                      />
                    )}
                  </div>
                </div>
                <div className={styles.body}>
                  {messageList.length > 0 ? (
                    <InfiniteScroll
                      dataLength={messageList.length}
                      height={600}
                      next={fetchMoreData}
                      style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                      }} //To put endMessage and loader to the top.
                      inverse={true}
                      hasMore={false}
                      loader={<h4>Loading...</h4>}
                    >
                      {messageList.map((item) => {
                        if (item.user.userId === user?.userId) {
                          //Sender
                          switch (item.type) {
                            case "text":
                              return (
                                <div
                                  className={styles.senderItem}
                                  key={item.messageId}
                                >
                                  <div className={styles.senderContainer}>
                                    <div
                                      className={styles.senderContent}
                                      onClick={() => {
                                        setDisplayRemoveMessageController(
                                          item.messageId
                                        );
                                      }}
                                    >
                                      {item.content}
                                      {/* Emoji */}
                                      {item.emoji && item.emoji.length > 1 && (
                                        <img
                                          src={item.emoji}
                                          className={styles.senderEmojiImage}
                                        />
                                      )}
                                      {/* Remove message */}
                                      {displayRemoveMessageController ===
                                        item.messageId && (
                                        <div
                                          className={
                                            styles.senderMessageController
                                          }
                                        >
                                          <div
                                            className={
                                              styles.senderMessageControllerHeader
                                            }
                                          >
                                            <FontAwesomeIcon
                                              icon={faXmark}
                                              onClick={
                                                handleRemoveDisplayRemoveMessageController
                                              }
                                            />
                                          </div>
                                          <div
                                            className={
                                              styles.senderMessageControllerBody
                                            }
                                          >
                                            <p
                                              onClick={() =>
                                                handleRemoveMessage(item)
                                              }
                                            >
                                              Remove
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            case "icon":
                              return (
                                <div
                                  className={styles.senderItem}
                                  key={item.messageId}
                                >
                                  <div className={styles.senderContainer}>
                                    <img
                                      src={item.content}
                                      className={styles.imageIcon}
                                    />
                                  </div>
                                </div>
                              );
                            case "removed":
                              return (
                                <div
                                  className={styles.senderItem}
                                  key={item.messageId}
                                >
                                  <div className={styles.senderContainer}>
                                    <div
                                      className={clsx(
                                        styles.senderContent,
                                        styles.removed
                                      )}
                                    >
                                      {item.content}
                                    </div>
                                  </div>
                                </div>
                              );
                            case "image":
                              return (
                                <div
                                  className={styles.senderItem}
                                  key={item.messageId}
                                >
                                  <div className={styles.senderContainer}>
                                    <img
                                      onClick={() => {
                                        setDisplayRemoveMessageController(
                                          item.messageId
                                        );
                                      }}
                                      src={item.media?.location}
                                      className={styles.imageType}
                                    />

                                    {/* Remove image */}
                                    {displayRemoveMessageController ===
                                      item.messageId && (
                                      <div className={styles.imageController}>
                                        <div
                                          className={
                                            styles.imageControllerContent
                                          }
                                        >
                                          <div
                                            className={
                                              styles.imageControllerContentHeader
                                            }
                                          >
                                            <button
                                              onClick={
                                                handleRemoveDisplayRemoveMessageController
                                              }
                                            >
                                              Đóng
                                            </button>
                                          </div>
                                          <div
                                            className={
                                              styles.imageControllerContentBody
                                            }
                                          >
                                            <p
                                              onClick={() =>
                                                handleRemoveMessage(item)
                                              }
                                            >
                                              Remove
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            case "call-video":
                              return (
                                <div
                                  className={styles.callVideoContainer}
                                  key={item.messageId}
                                >
                                  <div className={styles.callVideoContent}>
                                    <h3>Call Video</h3>
                                    <p>
                                      <FontAwesomeIcon
                                        icon={faVideo}
                                        className={styles.callVideoIcon}
                                      />{" "}
                                      {item.content}
                                    </p>
                                  </div>
                                </div>
                              );
                            default:
                              return (
                                <div key={item.messageId}>Something wrong</div>
                              );
                          }
                        } else {
                          //Receiver
                          switch (item.type) {
                            case "text":
                              return (
                                <div
                                  className={styles.receiverItem}
                                  key={item.messageId}
                                >
                                  {/* Emoji */}
                                  {displayEmojiPosition === item.messageId && (
                                    <div className={styles.emojiContainer}>
                                      <img
                                        src={assets.emoji.love}
                                        onClick={() => {
                                          handleUpdateMessageEmoji(
                                            item,
                                            assets.emoji.love
                                          );
                                        }}
                                      />
                                      <img
                                        src={assets.emoji.care}
                                        onClick={() => {
                                          handleUpdateMessageEmoji(
                                            item,
                                            assets.emoji.care
                                          );
                                        }}
                                      />
                                      <img
                                        src={assets.emoji.haha}
                                        onClick={() => {
                                          handleUpdateMessageEmoji(
                                            item,
                                            assets.emoji.haha
                                          );
                                        }}
                                      />
                                      <img
                                        src={assets.emoji.wow}
                                        onClick={() => {
                                          handleUpdateMessageEmoji(
                                            item,
                                            assets.emoji.wow
                                          );
                                        }}
                                      />
                                      <img
                                        src={assets.emoji.sad}
                                        onClick={() => {
                                          handleUpdateMessageEmoji(
                                            item,
                                            assets.emoji.sad
                                          );
                                        }}
                                      />
                                      <img
                                        src={assets.emoji.angry}
                                        onClick={() => {
                                          handleUpdateMessageEmoji(
                                            item,
                                            assets.emoji.angry
                                          );
                                        }}
                                      />

                                      <FontAwesomeIcon
                                        icon={faXmark}
                                        className={styles.emojiCloseIcon}
                                        onClick={
                                          handleRemoveDisplayEmojiPosition
                                        }
                                      />
                                    </div>
                                  )}
                                  <div className={styles.receiverContainer}>
                                    <img
                                      className={styles.receiverAvatar}
                                      src={item.user.avatar}
                                      alt="Receiver Avatar"
                                    />
                                    <p
                                      className={styles.receiverContent}
                                      onClick={() => {
                                        setDisplayEmojiPosition(item.messageId);
                                      }}
                                    >
                                      {item.content}

                                      {item.emoji && item.emoji.length > 1 && (
                                        <img
                                          src={item.emoji}
                                          className={styles.receiverEmojiImage}
                                        />
                                      )}
                                    </p>
                                  </div>
                                </div>
                              );
                            case "icon":
                              return (
                                <div
                                  className={styles.receiverItem}
                                  key={item.messageId}
                                >
                                  <div className={styles.receiverContainer}>
                                    <img
                                      className={styles.receiverAvatar}
                                      alt="Receiver Avatar"
                                      src={item.user.avatar}
                                    />
                                    <img
                                      src={item.content}
                                      className={styles.receiverImageIcon}
                                    />
                                  </div>
                                </div>
                              );
                            case "removed":
                              return (
                                <div
                                  className={styles.receiverItem}
                                  key={item.messageId}
                                >
                                  <div className={styles.receiverContainer}>
                                    <img
                                      className={styles.receiverAvatar}
                                      src={item.user.avatar}
                                      alt="Receiver Avatar"
                                    />
                                    <p
                                      className={clsx(
                                        styles.receiverContent,
                                        styles.removed
                                      )}
                                      onClick={() => {
                                        setDisplayEmojiPosition(item.messageId);
                                      }}
                                    >
                                      {item.content}
                                    </p>
                                  </div>
                                </div>
                              );
                            case "image":
                              return (
                                <div
                                  className={styles.receiverItem}
                                  key={item.messageId}
                                >
                                  <div className={styles.receiverContainer}>
                                    <img
                                      src={item.media?.location}
                                      className={styles.imageType}
                                    />
                                  </div>
                                </div>
                              );
                              case "call-video":
                                return (<div className={styles.callVideoContainer} key={item.messageId}>
                                  <div className={styles.callVideoContent}>
                                    <h3>Call Video</h3>
                                    <p><FontAwesomeIcon icon={faVideo} className={styles.callVideoIcon}/> {item.content}</p>
                                  </div>
                                </div>)
                              default:
                              return (
                                <div key={item.messageId}>Something wrong</div>
                              );
                          }
                        }
                      })}
                    </InfiniteScroll>
                  ) : (<div className={styles.notHaveMessage}>
                    Chưa có tin nhắn
                  </div>)}
                </div>
                <div className={styles.footer}>
                  <img
                    src={assets.emoji.love}
                    className={styles.senderLoveIcon}
                    onClick={() => {
                      handleSendIcon(assets.emoji.love);
                    }}
                  />
                  <div className={styles.inputContainer}>
                    <input
                      value={message}
                      onChange={(e) => handleChangeMessage(e)}
                      type="text"
                      placeholder="send something..."
                    />
                    <div className={styles.toolContainer}>
                      <FontAwesomeIcon
                        icon={faImage}
                        className={styles.toolIcon}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.uploadImageInput}
                        onChange={(e) => handleSendMedia(e)}
                      />
                    </div>
                    <div className={styles.toolContainer}>
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className={styles.toolIcon}
                      />
                    </div>
                    <div className={styles.toolContainer}>
                      <FontAwesomeIcon
                        icon={faFaceSmile}
                        className={styles.toolIcon}
                      />
                    </div>
                  </div>
                  <button
                    className={styles.btnSend}
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
