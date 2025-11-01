import React, { useEffect, useState } from "react";
import AppNotification from "../alerts/Notification";

function EditPaymentPopup({ payment, onClose, onPaymentUpdated, showNotification }) {
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [paymentRemarks, setPaymentRemarks] = useState('');

    const resetForm = () => {
        setPaymentAmount('');
        setPaymentDate('');
        setPaymentRemarks('');
    };

    useEffect(() => {
        if (payment) {
            setPaymentAmount(payment.payment_Amount.toString() || '');
            setPaymentDate(payment.payment_Date || new Date().toISOString().split('T')[0]);
            setPaymentRemarks(payment.payment_Remarks || '');
        }

        return () => {
            resetForm();
        };
    }, [payment]);

    const handleEditPayment = async (e) => {
        e.preventDefault();

        if (parseFloat(paymentAmount) <= 0) {
            showNotification("Payment amount must be greater than zero.");
            return;
        }

        try {
            const updatedPaymentData = {
                paymentId: payment.payment_ID,
                newAmount: parseFloat(paymentAmount),
                newDate: paymentDate,
                newRemarks: paymentRemarks,
            };

            const result = await window.electronAPI.editPayment(updatedPaymentData);

            if (result.success) {
                showNotification(`Payment record successfully updated.`);
                onPaymentUpdated();
                onClose();
            } else {
                showNotification(`Failed to edit payment: ${result.error}`);
            }
        } catch (error) {
            console.error("Error editing payment:", error);
            showNotification("An error occurred while editing the payment record.");
        }
    };

    if (!payment) {
        return null;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit Payment Record</h2>
                <form className="edit-payment-form form" onSubmit={handleEditPayment}>
                    
                    {/* --- Display Client and Balance Info --- */}
                    <div className="info-box" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #7E001B', borderRadius: '5px' }}>
                        <p>Client: <strong>{payment.client_Name}</strong></p>
                        {/* Display the balance from the transaction linked to this payment */}
                        <p>Remaining Balance Due: 
                            <strong style={{ color: payment.balance > 0 ? '#E64848' : '#28a745', marginLeft: '10px' }}>
                                ₱{payment.balance.toFixed(2)}
                            </strong>
                        </p>
                    </div>

                    {/* --- Payment Amount --- */}
                    <div className="row spacebetween">
                        <label>New Payment Amount:</label>
                        <input 
                            className="text-input" 
                            type="number" 
                            min="0.01" 
                            step="0.01" 
                            required
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)} 
                        />
                    </div>
                    
                    {/* --- Date Paid --- */}
                    <div className="row spacebetween">
                        <label>Date Paid:</label>
                        <input 
                            className="text-input" 
                            type="date" 
                            required
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)} 
                        />
                    </div>
                    
                    {/* --- Remarks --- */}
                    <div className="row spacebetween">
                        <label>Remarks:</label>
                        <input 
                            className="text-input" 
                            type="text"
                            value={paymentRemarks}
                            onChange={(e) => setPaymentRemarks(e.target.value)} 
                            placeholder="Downpayment, Full Payment, etc."
                        />
                    </div>

                    <div className="form-actions row spacebetween" style={{ justifyContent: 'center' }}>
                        <button type="submit">Update Record</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPaymentPopup;