import React from 'react';
import '../styles/DialogBox.css';

const DialogBox = ({ message = 'Good Job! Take a rest now.' }) => {
  return (
    <div className="dialog-box">
      <span className="dialog-message">{message}</span>
      <div className="dialog-pointer" />
    </div>
  );
};

export default DialogBox;
