import styles from "./styles.module.scss";
import MediaQuery from "react-responsive";

import Authenticate from "./Authenticate/auth.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faComment,
  faHouse,
  faMagnifyingGlass,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import avatar from "../../assets/avatar.png";
import { useAppDispatch, useAppSelector } from "../../storing/hook";
import {
  authSelector,
  checkAuthenticate,
} from "../../storing/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import AllUser from "./AllUser/all-user.index";
import Messenger from "./Messenger/messenger.index";
import { localSelector } from "../../storing/reducers/localSlice";

import CallVideo from "./Messenger/ChatRoom/CallVideo/call-video.index";
import { User } from "../../types/db";

interface RequestCallProps {
  sender: User | null;
  peerId: string;
  getRequest: boolean;
}

const Navbar = () => {
  const { isAuthenticated, user } = useAppSelector(authSelector);
  const { chatRoomSocket } = useAppSelector(localSelector);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [requestCallVideo, setRequestCallVideo] = useState<RequestCallProps>({
    sender: null,
    peerId: "",
    getRequest: false,
  });
  const [isVideoCallAccept, setIsVideoCallAccept] = useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      dispatch(checkAuthenticate());
    };
    checkAuth();
  }, []);

  useEffect(() => {

    
   
      window.addEventListener("beforeunload", (ev) => {
        chatRoomSocket?.emit('user-logout',{
          user
        })
      });
    
  }, [isAuthenticated, user,chatRoomSocket]);

  useEffect(() => {
    if (chatRoomSocket) {
      chatRoomSocket.on("server-request-call-video", (data) => {
        if (data.receiver.userId === user?.userId) {
          setRequestCallVideo({
            getRequest: true,
            sender: data.sender,
            peerId: data.peerId,
          });
        }
      });

      chatRoomSocket.on("server-send-end-call", (data) => {
        if (data.endCall && data.receiver.userId === user?.userId) {
          setRequestCallVideo({
            getRequest: false,
            sender: null,
            peerId: "",
          });
        }
      });

      chatRoomSocket.on("server-send-call-video-stop", (data) => {
        setIsVideoCallAccept(false);
      });
    }

    return () => {
      chatRoomSocket?.off("server-send-peer-id");
      chatRoomSocket?.off("server-send-end-call");
      chatRoomSocket?.off("server-send-call-video-stop");
    };
  }, [chatRoomSocket]);

  const handleDecline = () => {
    chatRoomSocket?.emit("client-send-decline-call-video", {
      dto: {
        isAccept: false,
        sender: requestCallVideo.sender,
        receiver: user,
      },
    });
    setRequestCallVideo({
      getRequest: false,
      sender: null,
      peerId: "",
    });
  };

  const handleAccept = () => {
    setIsVideoCallAccept(true);
    setRequestCallVideo({
      ...requestCallVideo,
      getRequest: false,
    });
  };

  return (
    <div className={styles.wrapper}>
      {/* Desktop */}
      <MediaQuery minWidth={769}>
        <div className="grid wide">
          <div className="row">
            <div className="col l-12 m-12 c-12">
              <div className={styles.container}>
                <h1
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Social
                </h1>
                <div className={styles.center}>
                  <FontAwesomeIcon
                    onClick={() => {
                      navigate("/");
                    }}
                    icon={faHouse}
                    className="mobileBottomIcon"    
                  />
                  <FontAwesomeIcon
                    onClick={() => {
                      navigate("/all-user");
                    }}
                    icon={faPerson}
                    className="mobileBottomIcon"                                                        
                  />
                  {/* <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="mobileBottomIcon"
                  /> */}
                  {/* <FontAwesomeIcon icon={faBell} className="mobileBottomIcon" /> */}
                  <Messenger />
                </div>
                {isAuthenticated ? (
                  <button
                    className={styles.username}
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    {user?.name}
                  </button>
                ) : (
                  <Authenticate />
                )}
              </div>
            </div>
          </div>
        </div>
      </MediaQuery>
      {/* ************************************************************************************************************** */}
      {/* Mobile  */}
      {/* ************************************************************************************************************** */}
      <MediaQuery maxWidth={768}>
        <div className="grid wide">
          <div className="row">
            <div className="col l-12 m-12 c-12">
              <div className={styles.mobileContainer}>
                <h1>Social</h1>
                {isAuthenticated ? (
                  <button
                    className={styles.username}
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    {user?.name}
                  </button>
                ) : (
                  <Authenticate />
                )}
              </div>
              <div className={styles.mobileContainerBottom}>
                <FontAwesomeIcon
                  icon={faHouse}
                  className="mobileBottomIcon"
                  onClick={() => {
                    navigate("/");
                  }}
                />
                <FontAwesomeIcon
                  onClick={() => {
                    navigate("/all-user");
                  }}
                  icon={faPerson}
                  className="mobileBottomIcon"
                />
                {/* <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="mobileBottomIcon"
                />
                <FontAwesomeIcon icon={faBell} className="mobileBottomIcon" /> */}
                <Messenger />
              </div>
            </div>
          </div>
        </div>
      </MediaQuery>
      {/* Request calling..._______________________________________________________________________________ */}
      {requestCallVideo.getRequest && (
        <div className={styles.RequestCallingWrapper}>
          <div className={styles.RequestCallingContainer}>
            <img src={requestCallVideo.sender?.avatar} alt="" />
            <p>
              {requestCallVideo.sender?.name} want to make a video call with you
            </p>
            <div className={styles.buttonContainer}>
              <button className={styles.btnDecline} onClick={handleDecline}>
                Decline
              </button>
              <button className={styles.btnAccept} onClick={handleAccept}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
      {isVideoCallAccept && (
        <CallVideo
          onClose={() => {}}
          type="answer"
          callPeerId={requestCallVideo.peerId}
          sender={requestCallVideo.sender}
          receiver={user}
        />
      )}
    </div>
  );
};

export default React.memo(Navbar);
