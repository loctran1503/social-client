import { faPhone, faVideo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Peer from "peerjs";
import { useAppSelector } from "../../../../../storing/hook";
import { localSelector } from "../../../../../storing/reducers/localSlice";
import { User } from "../../../../../types/db";
import { toast, ToastContainer } from "react-toastify";
import { authSelector } from "../../../../../storing/reducers/authSlice";
import { secondsToTime } from "../../../../../utils/MediaTimingCoverter";

export interface CallVideoProps {
  onClose: () => void;
  receiver?: User | null;
  sender?:User | null
  type: "call" | "answer";
  callPeerId?: string;
}

const CallVideo = ({ onClose, receiver, type, callPeerId,sender }: CallVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { chatRoomSocket } = useAppSelector(localSelector);
  const { user } = useAppSelector(authSelector);
  const [isCallVideoAccept, setIsCallVideoAccept] = useState(false);

  const localMediaTrack = useRef<MediaStream | null>(null);
  const remoteMediaTrack = useRef<MediaStream | null>(null);

  const [timing, setTiming] = useState(0);

  useEffect(() => {
   
    
    const peer = new Peer({
      config: {
        iceServers: [
          {
            url: "stun:relay.metered.ca:80",
          },
          {
            url: "turn:relay.metered.ca:80",
            username: "40538a2cd8159e307da6a29c",
            credential: "yLtFOud7VqtVxTRn",
          },
          {
            url: "turn:relay.metered.ca:443",
            username: "40538a2cd8159e307da6a29c",
            credential: "yLtFOud7VqtVxTRn",
          },
        ],
      },
    });

    //generate id
    //type:call

    peer.on("open", (id) => {
      if (type === "call" && sender?.userId===user?.userId) {
        chatRoomSocket?.emit("client-request-call-video", {
          dto: {
            peerId: id,
            receiver: receiver,
            sender: user,
          },
        });
      }
      //get local video
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          //call from receiver to sender
          //type:answer

          switch (type) {
            case "answer": {
              if (callPeerId && receiver?.userId === user?.userId) {
                const call = peer.call(callPeerId, stream);
                setIsCallVideoAccept(true);
                call.on("error", (error) => {
                  console.log(error);
                });

                call.on("stream", (remoteStream) => {
                  remoteMediaTrack.current = remoteStream;
                  remoteVideoRef.current!.srcObject = remoteStream;
                });
                call.on("close", () => {
                  if (localMediaTrack.current && remoteMediaTrack.current) {
                    localMediaTrack.current.getVideoTracks()[0].stop();
                    localMediaTrack.current.getAudioTracks()[0].stop();

                    remoteMediaTrack.current.getVideoTracks()[0].stop();
                    remoteMediaTrack.current.getAudioTracks()[0].stop();
                  }
                });
              }
              break;
            }
            //anwser from sender to receiver
            //type:answer
            case "call": {
              if(sender?.userId===user?.userId){
                peer.on("call", (call) => {
                  setIsCallVideoAccept(true);
                  call.answer(stream);
                  call.on("stream", function (remoteStream) {
                    remoteMediaTrack.current = remoteStream;
  
                    remoteVideoRef.current!.srcObject = remoteStream;
                  });
                });
              }
              break;
            }
            default:
              break;
          }
          //display local video
          videoRef.current!.srcObject = stream;
          localMediaTrack.current = stream;
        })
        .catch((err) => console.log("getUserMedia err: ", err));

      peer.on("error", (err) => {
        console.log(err);
      });
    });

    return () => {
      if (localMediaTrack.current && remoteMediaTrack.current) {
        localMediaTrack.current.getVideoTracks()[0].stop();
        localMediaTrack.current.getAudioTracks()[0].stop();

        remoteMediaTrack.current.getVideoTracks()[0].stop();
        remoteMediaTrack.current.getAudioTracks()[0].stop();
      }
    
    };
  }, []);

  //timing
  useEffect(() => {
    let timeOutId: NodeJS.Timer;
    if (isCallVideoAccept) {
      timeOutId = setInterval(() => {
        setTiming((prevState) => prevState + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timeOutId);
    };
  }, [isCallVideoAccept]);

  //server-send-decline
  //type:call
  useEffect(() => {
    if (chatRoomSocket) {
      chatRoomSocket.on("server-send-decline-call-video", (data) => {
        if (
          !data.isAccept &&
          data.sender.userId === user?.userId &&
          videoRef.current &&
          localMediaTrack.current
        ) {
          videoRef.current.currentTime = 0;
          videoRef.current.pause();
          videoRef.current.srcObject = null;
          videoRef.current.remove();
          localMediaTrack.current.getVideoTracks()[0].stop();
          localMediaTrack.current.getAudioTracks()[0].stop();
          onClose();
          alert("user decline video call");
        }
      });
    }

    return () => {
      chatRoomSocket?.off("server-send-decline-call-video");
    };
  }, [chatRoomSocket, user]);

  //client-send-end-call
  //type:call
  const handleRequestEndCall = () => {
    if (chatRoomSocket && type === "call" && sender?.userId===user?.userId && localMediaTrack.current) {
      chatRoomSocket.emit("client-send-end-call", {
        dto:{
          sender,
        receiver
        }
      });
      localMediaTrack.current.getVideoTracks()[0].stop();
      localMediaTrack.current.getAudioTracks()[0].stop();
      onClose();
    }
  };

  const handleStopCall = () => {
    if (
      videoRef.current &&
      remoteVideoRef.current &&
      localMediaTrack.current &&
      remoteMediaTrack.current
    ) {
      localMediaTrack.current.getVideoTracks()[0].stop();
      localMediaTrack.current.getAudioTracks()[0].stop();

      remoteMediaTrack.current.getVideoTracks()[0].stop();
      remoteMediaTrack.current.getAudioTracks()[0].stop();

      if (chatRoomSocket) {
        chatRoomSocket.emit("client-send-call-video-stop", {
          dto: {
            sender,
            receiver,
            timing: secondsToTime(timing),
          },
        });
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className="grid wide">
        <div className="row">
          <div className="col l-12 m-12 c-12">
            <div className={styles.modalcontainer}>
              {receiver && type === "call" && !isCallVideoAccept && (
                <span className={styles.callingContainer}>
                  <img src={receiver.avatar} />
                  <p>Video calling to {receiver.name}</p>
                  <button
                    className={styles.iconCallEnded}
                    onClick={handleRequestEndCall}
                  >
                    End Calling
                  </button>
                </span>
              )}
              {/* Display video */}
              {isCallVideoAccept && (
                <div className="row">
                  <div className="col l-4 l-o-4 m-4 m-o-4 c-4 c-o-4">
                    <div className={styles.timeControl}>
                      <div></div>
                      <p>{secondsToTime(timing)}</p>
                      <FontAwesomeIcon
                        icon={faPhone}
                        className={styles.endCallIcon}
                        onClick={handleStopCall}
                      />
                    </div>
                  </div>
                </div>
              )}
              {isCallVideoAccept && (
                <video
                  ref={remoteVideoRef}
                  className={styles.remoteVideo}
                  onLoadedMetadata={() => {
                    remoteVideoRef.current?.play();
                  }}
                />
              )}
              {type === "answer" && <div></div>}
              <video
                ref={videoRef}
                onLoadedMetadata={() => {
                  videoRef.current?.play();
                }}
                className={styles.video}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default CallVideo;
