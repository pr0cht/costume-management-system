import React, { useEffect, useState } from "react";
import AppNotification from "../alerts/Notification";

function AddNewPayment({ onClose, onPaymentAdded }) {
    const [showPopup, setShowPopup] = useState(false); 
    
    const [allTransactions, setAllTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedTransactionId, setSelectedTransactionId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentRemarks, setPaymentRemarks] = useState('');

    const [selectedTransactionDetails, setSelectedTransactionDetails] = useState(null);

    const fetchTransactionsWithBalance = async () => {
        setIsLoading(true);
        const result = await window.electronAPI.getTransactionsDue(); 

        if (result.success) {
            setAllTransactions(result.data);
        } else {
            console.error("Failed to fetch transactions:", result.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTransactionsWithBalance();
    }, []);

    useEffect(() => {
        const transactionId = parseInt(selectedTransactionId);
        if (transactionId) {
            const details = allTransactions.find(t => t.transaction_ID === transactionId);
            setSelectedTransactionDetails(details);
            if (details) {
                setPaymentAmount(details.balance.toFixed(2));
            }
        } else {
            setSelectedTransactionDetails(null);
            setPaymentAmount('');
        }
    }, [selectedTransactionId, allTransactions]);

    const handleAddNewPayment = async (e) => {
        e.preventDefault();

        if (!selectedTransactionId || !paymentAmount || parseFloat(paymentAmount) <= 0) {
            showNotification("Please select a transaction and enter a valid payment amount.");
            return;
        }
        
        if (selectedTransactionDetails && parseFloat(paymentAmount) > selectedTransactionDetails.balance) {
            showNotification(`Cannot overpay. Remaining balance is ₱${selectedTransactionDetails.balance.toFixed(2)}.`);
            return;
        }

        const paymentData = {
            transactionId: parseInt(selectedTransactionId),
            paymentAmount: parseFloat(paymentAmount),
            paymentDate: paymentDate,
            paymentRemarks: paymentRemarks,
        };

        const result = await window.electronAPI.addPayment(paymentData);
        if (result.success) {
            showNotification(`Payment recorded successfully! Payment ID: ${result.paymentId}`);
            onPaymentAdded(); 
            setShowPopup(false); 
        } else {
            showNotification(`Failed to record payment: ${result.error}`);
        }
    };

    const handleOpenPopup = () => {
        setSelectedTransactionId('');
        setSelectedTransactionDetails(null);
        setPaymentAmount('');
        setPaymentRemarks('');
        setShowPopup(true); 
    };

    return (
        <div>
            <button className="add-payment-btn button" onClick={handleOpenPopup}>Record Payment</button>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Record New Payment</h2>
                        <form className="add-payment-form form" onSubmit={handleAddNewPayment}>

                            <div className="row spacebetween">
                                <label>Select Transaction:</label>
                                {isLoading ? <p>Fetching outstanding balances...</p> : (
                                    <select 
                                        value={selectedTransactionId} 
                                        onChange={(e) => setSelectedTransactionId(e.target.value)} 
                                        required
                                    >
                                        <option value="">-- Choose Client (Balance Due) --</option>
                                        {allTransactions.map(t => (
                                            <option key={t.transaction_ID} value={t.transaction_ID}>
                                                {t.client_Name} (₱{t.balance.toFixed(2)} Due)
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {selectedTransactionDetails && (
                                <div className="info-box" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
                                    <p>Client: <strong>{selectedTransactionDetails.client_Name}</strong></p>
                                    <p>Remaining Balance Due: 
                                        <strong style={{ color: '#E64848', marginLeft: '10px' }}>
                                            ₱{selectedTransactionDetails.balance.toFixed(2)}
                                        </strong>
                                    </p>
                                </div>
                            )}

                            <div className="row spacebetween">
                                <label>Payment Amount:</label>
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

                            <div className="form-actions row spacebetween">
                                <button type="submit">Record Payment</button>
                                <button type="button" onClick={() => setShowPopup(false)}>Cancel</button> 
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddNewPayment;