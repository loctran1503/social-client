import React, { useCallback, useEffect, useState } from "react";
import { ToolbarEnum } from "../../../types/local";
import styles from "./styles.module.scss";
import avatar from "../../../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../../../storing/hook";
import { authSelector } from "../../../storing/reducers/authSlice";
import { CreateCommunityMessage, MessageIO, MessageResponse } from "../../../types/chat";
import { getCommunityMessageApi } from "../../../utils/api/community-chat";
import { socketLink } from "../../../utils/api/link";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import clsx from "clsx";
import { LIMIT_SIZE_FOR_UPLOAD } from "../../../utils/constants";
const Community = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, isAuthenticated, isLoading, accessToken } =
    useAppSelector(authSelector);
  const [message, setMessage] = useState<CreateCommunityMessage>({
    content:'',
  });
  const [previewImage,setPreviewImage] = useState('') 
  const [messageResponse, setMessageResponse] = useState<MessageResponse>({
    messageList: [],
    hasMore: false,
    code: 0,
    success: false,
    message: "",
  });
  const [messageBlockingCountDown, setmessageBlockingCountDown] = useState(0);

  useEffect(() => {
    const getMessage = async () => {
      const serverResult = await getCommunityMessageApi();
      if (serverResult.messageList && serverResult.messageList.length > 0) {
        setMessageResponse({
          ...messageResponse,
          hasMore: serverResult.hasMore,
          messageList: serverResult.messageList,
        });
      }
    };
    getMessage();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const socket = io(socketLink.chats.link, {
        transports: ["websocket"],
        path: socketLink.chats.path,
        ...(isAuthenticated
          ? {
              auth: {
                token: accessToken as string,
              },
            }
          : {}),
      });
      socket.on("connect", () => {


        socket.emit("client-send-indentify", {
          name: isAuthenticated ? user?.name : "Guest",
        });
        setSocket(socket);
      });

      socket.on("connect_error", (err: any) => console.log(err));
      socket.on("connect_failed", (err: any) => console.log(err));

      return () => {
   
        socket.disconnect();
      };
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (messageBlockingCountDown > 0) {
      const timeoutId = setTimeout(() => {
        setmessageBlockingCountDown(messageBlockingCountDown - 1000);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [messageBlockingCountDown]);

  useEffect(() => {
    if (socket && socket.active) {
      socket.on("server-send-message", (value: MessageIO) => {
    
        if ( value.user && value.timestampBlocking) {
          if (value.user.userId === user?.userId) {
            setmessageBlockingCountDown(value.timestampBlocking);
          }
          setMessageResponse((oldArray) => ({
            ...oldArray,
            messageList: [value, ...(oldArray.messageList || [])],
          }));
        }
      });
    }

    return () => {
      socket?.off("server-send-message");
    };
  }, [socket]);

  useEffect(() =>{

    return () => {
      if(previewImage.length>0){
        URL.revokeObjectURL(previewImage)
      }
    };
  },[previewImage])

  const handleSendMessage = useCallback(() => {
   
    
     if (messageBlockingCountDown === 0) {
      if(message.content.trim().length>=1){
      
        
        socket?.emit("client-send-message", {
          message,
        });
        setMessage({
          content:''
        });
        setPreviewImage('')
        }else{
          alert('message not valid')
        }
      }
  
  }, [message]);

  const handleMessageChanging = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage({...message,content:e.target.value});
  };

  const fetchMoreData = async () => {
    if (messageResponse.messageList) {
      const serverResult = await getCommunityMessageApi(
        messageResponse.messageList[messageResponse.messageList.length - 1]
          .timestamp
      );

      if (serverResult.messageList) {
        const temp = messageResponse.messageList.map((item) => item);
        setMessageResponse((oldValue) => ({
          ...oldValue,
          hasMore: serverResult.hasMore,
          messageList: temp.concat(serverResult.messageList || []),
        }));
      }
    }
  };

  const handleAddImage = ( event: React.ChangeEvent<HTMLInputElement>) =>{
    if(event.target.files && event.target.files.length>0){
      const file: File = event.target.files[0];
      if(file.size>=LIMIT_SIZE_FOR_UPLOAD){
        alert('you cannot upload file more than 30MB');
        return;
      }
      setPreviewImage(URL.createObjectURL(file))
      setMessage({...message,media:{
        buffer:file,
        originalname:file.name,
        mimetype:file.type,
        size:file.size
      }})
    }
  }

  return (
    <div>
      <div className="grid wide">
        <div className="row">
          <div className="col l-8 l-o-2 m-12 c-12">
            <div className={styles.container}>
              <div className={styles.header}>{ToolbarEnum.COMMUNITY}</div>
              <div className={styles.body}>
                <div className={styles.messageList}>
                  {messageResponse.messageList && (
                    <InfiniteScroll
                      dataLength={messageResponse.messageList.length}
                      height={500}
                      next={fetchMoreData}
                      style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                      }} //To put endMessage and loader to the top.
                      inverse={true} //
                      hasMore={messageResponse.hasMore || false}
                      loader={<h4>Loading...</h4>}
                    >
                      {messageResponse.messageList.length > 0 &&
                        messageResponse.messageList.map((item) =>
                          item.user?.userId === user?.userId ? (
                            <div
                              className={styles.senderItem}
                              key={item.messageId}
                            >
                              <div className={styles.senderItemContainer}>
                              <p className={clsx(styles.senderContent,item.media && styles.senderContentWithImage)}>
                                {item.content}
                              </p>
                              {item.media && <img src={item.media.location} className={styles.senderImageMessage}/>}
                              </div>
                            </div>
                          ) : (
                            <div
                              className={styles.receiverItem}
                              key={item.messageId}
                            >
                              <div className={styles.receiverItemContainer}>
                              <img
                                src={item.user?.avatar}
                                className={styles.receiverAvatar}
                                alt="Receiver Avatar"
                              />
                              <div>
                              <p className={clsx(styles.receiverContent,item.media && styles.receiverContentWithImage)}>
                                {item.content}
                              </p>
                              {item.media && <img src={item.media.location} className={styles.receiverImageMessage}/>}
                              </div>
                              </div>
                            </div>
                          )
                        )}
                    </InfiniteScroll>
                  )}
                </div>
              </div>
              {isAuthenticated && (
                <div className={styles.footer}>
                  <img src={avatar} className={styles.footerAvatar} alt="" />
                  <div className={styles.input}>
                    <div className={styles.inputAndMedia}>
                    <input
                      type="text"
                      placeholder="Add a message..."
                      disabled={messageBlockingCountDown > 0}
                      value={message.content}
                      onChange={(e) => {
                        handleMessageChanging(e);
                      }}
                    />
                    {previewImage.length>1 && <img src={previewImage} alt="" />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className={styles.imageToolContainer}>
                        <FontAwesomeIcon
                          icon={faImage}
                          className={styles.toolIcon}
                        />
                        <input  type="file" accept="image/*" onChange={e => handleAddImage(e)} />
                      </div>
                     
                    </div>
                  </div>
                  <div
                    className={clsx(
                      styles.btnSend,
                      messageBlockingCountDown > 0 &&
                        styles.messageBlockingActive
                    )}
                    onClick={handleSendMessage}
                  >
                    {" "}
                    {messageBlockingCountDown > 0
                      ? messageBlockingCountDown / 1000
                      : "Send"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
