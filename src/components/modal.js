import React from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const customStyles = {
  content: {
    top: "10px",
    right: "10px",
    bottom: "auto",
    left: "auto",
    width: "300px",
    height: "200px",
    transform: "translate(-10%, 10%)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const PopUpModal = ({ isOpen, setIsOpen, children, title }) => {
    return (
      <div>
        <ReactModal
          isOpen={isOpen}
          contentLabel={title}
          onRequestClose={() => setIsOpen(false)}
          style={customStyles}
        >
          {children}
        </ReactModal>
      </div>
    );
};

export default PopUpModal;