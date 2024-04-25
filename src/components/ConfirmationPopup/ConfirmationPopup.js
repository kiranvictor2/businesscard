// ConfirmationPopup.js
import React from 'react';

function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="popup">
      <div className="popup-inner">
        <p>{message}</p>
        <div>
          <button className='custom-button' onClick={onConfirm}>Yes</button>
          <button className='custom-button' onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;
