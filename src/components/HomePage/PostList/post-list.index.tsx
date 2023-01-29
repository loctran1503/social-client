import React from "react";
import styles from "./styles.module.scss";
import avatar from "../../../assets/avatar.png";
import rollRoyceImage from "../../../assets/roll-royce.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faDownLong, faImage, faUpLong } from "@fortawesome/free-solid-svg-icons";
const PostList = () => {
  return (
    <div>
      <div className="grid wide">
        <div className="row">
          <div className="col l-6 l-o-3 m8 m-o-2 c12">
            <div className={styles.container}>
              <div className={styles.postItem}>
                {/* ********************************************************************************** */}
                {/* Header */}
                {/* ********************************************************************************** */}
                <div className={styles.postHeader}>
                  <div className={styles.onwerContainer}>
                    <img src={avatar} alt="avatar" />
                    <div className={styles.onwerInfo}>
                      <h4>Trần Phước Lộc</h4>
                      <p>1 phút trước</p>
                    </div>
                  </div>
                  <div className={styles.postController}></div>
                </div>
                {/* ********************************************************************************** */}
                {/* Body */}
                {/* ********************************************************************************** */}
                <div className={styles.postBody}>
                  <div className={styles.content}>
                    <p>
                      Rolls Royce Dawn 2023 còn được biết đến là một mẫu xe mui
                      trần nổi tiếng mang phong cách riêng biệt. Ngoại hình của
                      Rolls Royce Dawn 2023...
                    </p>
                    <img
                      className={styles.postImage}
                      src={rollRoyceImage}
                      alt=""
                    />
                  </div>
                  <div className={styles.interactive}>
                    <p className={styles.currentVote}>
                      23 người thấy bài viết này hữu ích
                    </p>
                    <div className={styles.voteController}>
                      <p className={styles.upVote}>
                        <FontAwesomeIcon icon={faUpLong} style={{marginRight:4}}/>
                        Hữu ích
                      </p>

                      <p className={styles.downVote}><FontAwesomeIcon icon={faDownLong} style={{marginRight:4}}/> Không hữu ích</p>
                    </div>
                  </div>
                  <div className={styles.commentContainer}>
                    <div className={styles.viewAllComment}>
                      <span>Xem tất cả 54 bình luận</span>
                    </div>
                    <div className={styles.commentItem}>
                      <div className={styles.left}>
                        <img className={styles.commentAvatar} src={avatar} />
                        <div className={styles.leftBody}>
                          <div>
                          <div className={styles.commentUSerNameAndVoteCounting}>
                            <h4>Trần Phước Lộc</h4>
                            <p className={styles.upvoteCounting}>
                                <FontAwesomeIcon icon={faUpLong} style={{marginRight:4}}/>
                                24
                            </p>
                            <p className={styles.downvoteCounting}>
                                <FontAwesomeIcon icon={faDownLong} style={{marginRight:4}}/>
                                123
                            </p>
                          </div>
                          </div>
                          <div className={styles.commentContent}>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad aspernatur suscipit est facere sunt ratione repudiandae possimus odio perspiciatis recusandae, explicabo excepturi deleniti dolorum totam ipsam quasi odit ab commodi?
                            </p>
                            <div className={styles.commentContentVoteContainer}>
                                <p className={styles.commentContentUpVote}>Hữu ích</p>
                                <p className={styles.commentContentDownVote}>Không hữu ích</p>
                                <p className={styles.commentContentTimestamp}>1 giờ trước</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>

                    {/*  */}
                    <div className={styles.commentItem}>
                      <div className={styles.left}>
                        <img className={styles.commentAvatar} src={avatar} />
                        <div className={styles.leftBody}>
                          <div>
                          <div className={styles.commentUSerNameAndVoteCounting}>
                            <h4>Trần Phước Lộc</h4>
                            <p className={styles.upvoteCounting}>
                                <FontAwesomeIcon icon={faUpLong} style={{marginRight:4}}/>
                                24
                            </p>
                            <p className={styles.downvoteCounting}>
                                <FontAwesomeIcon icon={faDownLong} style={{marginRight:4}}/>
                                123
                            </p>
                          </div>
                          </div>
                          <div className={styles.commentContent}>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad aspernatur suscipit est facere sunt ratione repudiandae possimus odio perspiciatis recusandae, explicabo excepturi deleniti dolorum totam ipsam quasi odit ab commodi?
                            </p>
                            <div className={styles.commentContentVoteContainer}>
                                <p className={styles.commentContentUpVote}>Hữu ích</p>
                                <p className={styles.commentContentDownVote}>Không hữu ích</p>
                                <p className={styles.commentContentTimestamp}>1 giờ trước</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                {/* ********************************************************************************** */}
                {/* Footer */}
                <div className={styles.postFooter}>
                    <div className={styles.postFooterTool}>
                        <FontAwesomeIcon icon={faImage} className={styles.postFooterToolImage}/>
                        <input type="file" />
                    </div>
                    <div className={styles.postFooterInput}>
                        <input placeholder="Add a comment..." />
                    </div>
                    <div className={styles.postFooterSendComment}>
                        Send
                    </div>
                </div>
                {/* ********************************************************************************** */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
