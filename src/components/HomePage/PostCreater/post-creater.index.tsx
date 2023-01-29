import React from "react";
import Livestream from "./LiveStream/livestream.index";
import Question from "./Question/question.index";
import styles from './styles.module.scss'

const PostCreater = () => {
  return (
    <>
      <div className="grid wide">
        <div className="row">
          <div className="col l-6 l-o-3 m-8 m-o-2 c-12">
            <div className={styles.container}>
                <div className={styles.header}>
                    <span>
                    What do you want to do today?
                    </span>
                </div>
                <div className={styles.body}>
                  <Question/>
                    <Livestream/>

                </div>
                <div className={styles.footer}>
                  
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCreater;
