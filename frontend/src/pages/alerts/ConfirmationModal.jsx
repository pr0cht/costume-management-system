import React from 'react';

function ConfirmationModal({ message, onConfirm, onCancel }) {
    return (
        <div className="popup-overlay">
            <div className="popup-content modal-small">
                <h3>Confirmation</h3>
                <p>{message}</p>
                <div className="form-actions spacebetween" style={{ justifyContent: 'center' }}>
                    <button 
                        type="button" 
                        onClick={onCancel}
                        style={{ backgroundColor: '#ccc', color: '#333' }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={onConfirm}
                        style={{ backgroundColor: '#E64848', color: 'white' }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;