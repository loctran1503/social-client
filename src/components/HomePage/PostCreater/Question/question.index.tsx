import { faCircleQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import styles from "./styles.module.scss";
import Modal from "react-modal";
import { customModalStyles } from "../../../../types/modal";
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
Modal.setAppElement("#root");
const initContent = {
  entityMap: {},
  blocks: [
    {
      key: '637gr',
      text: 'Hello',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};
const Question = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content,setContent] = useState<any>(convertFromRaw(initContent))
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return (

      <div >
       <div className={styles.icon} onClick={openModal}>
       <FontAwesomeIcon
          icon={faCircleQuestion}
          className={styles.iconQuestion}
          
        />
        <p>Post</p>
       </div>
        <div>
          <Modal
            isOpen={isOpen}
            onRequestClose={() => false}
            style={customModalStyles}
          >
            <div className={styles.modalContainer}>
              <p onClick={() => console.log(content)}>Test</p>
              <div className={styles.header}>
                <FontAwesomeIcon icon={faXmark} className={styles.closeModalIcon} onClick={closeModal}/>
              </div>
              {isOpen && <Editor
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                onContentStateChange={(newContent) => {
                 if(newContent!==content){
                  setContent(content)
                 
                  
                 }
                 
                 
                }}
                toolbar={{
                  options: ['colorPicker', 'emoji', 'inline'],
                  fontFamily: {
                    options: ['Roboto'],
                    className: true,
                    component: true,
                    dropdownClassName: true
                  }
                }}
              />}
            </div>
                {
                  <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: draftToHtml(content) }}
                ></div>
                }
          </Modal>
        </div>
      </div>

  );
};

export default Question;
