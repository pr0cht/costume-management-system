import React, { useEffect, useState } from "react";
import AppNotification from "../alerts/Notification";

function AddChargePopup({ client, onClose, onChargeAdded }) {
    const [clientTransactions, setClientTransactions] = useState([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

    const [selectedTransactionId, setSelectedTransactionId] = useState('');
    const [chargeAmount, setChargeAmount] = useState('');
    const [chargeDescription, setChargeDescription] = useState('');
    const [chargeDate, setChargeDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (client) {
            setIsLoadingTransactions(true);

            const fetchTransactionsForClient = async () => {
                const result = await window.electronAPI.getTransactionsByClient(client.client_ID);

                if (result.success) {
                    setClientTransactions(result.data);
                } else {
                    console.error("Failed to fetch client transactions:", result.error);
                }
                setIsLoadingTransactions(false);
            };

            fetchTransactionsForClient();
        }
    }, [client]);

    const handleAddCharge = async (e) => {
        e.preventDefault();

        if (!selectedTransactionId || !chargeAmount || !chargeDescription) {
            showNotification("Please select a transaction and fill in the amount and description.");
            return;
        }

        try {
            const chargeData = {
                transactionId: parseInt(selectedTransactionId),
                amount: parseFloat(chargeAmount),
                description: chargeDescription,
                chargeDate: chargeDate,
            };

            const result = await window.electronAPI.addCharge(chargeData);

            if (result.success) {
                showNotification(`Charge recorded successfully! Amount: ₱${chargeAmount}`);
                onChargeAdded(); // Refresh the parent client/payments list
                onClose();
            } else {
                showNotification(`Failed to add charge: ${result.error}`);
            }
        } catch (error) {
            console.error("Error adding charge:", error);
            showNotification("An unexpected error occurred while adding the charge.");
        }
    };

    if (!client) {
        return null;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Add Charge to {client.client_Name}</h2>
                <form className="add-charge-form form" onSubmit={handleAddCharge}>

                    {/* --- Client/Transaction Selection --- */}
                    <div className="row spacebetween">
                        <label>Select Transaction:</label>
                        {isLoadingTransactions ? <p>Loading transactions...</p> : (
                            <select
                                value={selectedTransactionId}
                                onChange={(e) => setSelectedTransactionId(e.target.value)}
                                required
                            >
                                <option value="">-- Choose Client (Status) --</option>
                                {clientTransactions.map(t => (
                                    <option key={t.transaction_ID} value={t.transaction_ID}>
                                        {t.client_Name}
                                        (TID: {t.transaction_ID}
                                        — {t.balance <= 0 ? 'Fully Paid' : `₱${t.balance.toFixed(2)} Due`}
                                        )
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* --- Charge Amount --- */}
                    <div className="row spacebetween">
                        <label>Charge Amount (₱):</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            required
                            value={chargeAmount}
                            onChange={(e) => setChargeAmount(e.target.value)}
                        />
                    </div>

                    {/* --- Charge Description --- */}
                    <div className="row spacebetween">
                        <label>Description:</label>
                        <input
                            type="text"
                            required
                            value={chargeDescription}
                            onChange={(e) => setChargeDescription(e.target.value)}
                            placeholder="e.g., Late Fee, Damaged Zipper"
                        />
                    </div>

                    {/* --- Date --- */}
                    <div className="row spacebetween">
                        <label>Charge Date:</label>
                        <input
                            type="date"
                            required
                            value={chargeDate}
                            onChange={(e) => setChargeDate(e.target.value)}
                        />
                    </div>

                    <div className="form-actions row spacebetween">
                        <button type="submit">Record Charge</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddChargePopup;