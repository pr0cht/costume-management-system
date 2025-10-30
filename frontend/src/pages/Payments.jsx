import React, { useState, useEffect } from 'react';
import EditPaymentPopup from './popups/editPaymentPopup';
import ConfirmationModal from './alerts/ConfirmationModal';
import AddNewPayment from './popups/addNewPayment';

function Payments() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPayment, setEditingPayment] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [withBalance, setWithBalance] = useState(false);
  const [sort, setSort] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC'); // Default to recently paid

  const fetchPayments = async () => {
    setIsLoading(true);
    const filters = {
      searchTerm: searchTerm,
      withBalance: withBalance,
      sort: sort,
      sortOrder: sortOrder,
    };

    const result = await window.electronAPI.getPayments(filters);
    if (result.success) {
      setPayments(result.data);
    } else {
      alert(`Failed to fetch payments: ${result.error}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      fetchPayments();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, withBalance, sort, sortOrder]);

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    console.log('Editing payment:', payment); 
  };
  
  const handleDelete = (payment) => {
    setPaymentToDelete(payment); 
    setShowConfirmModal(true); 
  };

const handleConfirmDelete = async () => {
  setShowConfirmModal(false); 
  
  if (!paymentToDelete) return;

  try {
    const paymentId = paymentToDelete.payment_ID;

    console.log('Confirmed deletion for ID:', paymentId);
        const result = await window.electronAPI.deletePayment(paymentId);
    
    if (result.success) {
      alert('Payment record successfully deleted and balance adjusted.');
      
      fetchPayments(); 
    } else {
      alert(`Failed to delete payment record: ${result.error}`);
    }
  } catch (error) {
    console.error('Deletion failed:', error);
    alert('An unexpected error occurred during payment deletion.');
  }
  setPaymentToDelete(null); 
};

  return (
    <div className="page payments">
      <div className="payments-topbar">
        <AddNewPayment 
          onPaymentAdded={fetchPayments}
        />
        <input
          type="text"
          className="payments-search"
          placeholder="Search client names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="payments-filter-btn button"
          onClick={() => setFilterOpen((open) => !open)}
        >
          Filter
        </button>
        {showConfirmModal && (
        <ConfirmationModal
          message={`Are you sure you want to delete payment record ${paymentToDelete.payment_ID} by ${paymentToDelete.client_Name}? This will affect the transaction balance.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowConfirmModal(false);
            setPaymentToDelete(null);
          }}
        />
      )}
      </div>
      
      {/* --- Filter Options --- */}
      {filterOpen && (
        <div className="payments-filter-popup">
          <h4>Filter Options</h4>
          <div className="filter-options-group">
            <label>
              <input type="checkbox"
                checked={withBalance}
                onChange={() => setWithBalance(!withBalance)}
              /> With Outstanding Balance
            </label>
            
            <label>Sort by: </label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="date">Payment Date</option>
              <option value="amount">Amount</option>
              <option value="balance">Balance Due</option>
            </select>
            
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="DESC">Latest/Highest</option>
              <option value="ASC">Oldest/Lowest</option>
            </select>
          </div>
        </div>
      )}
      
      {/* --- Payments Table --- */}
      <div className="payments-table">
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Client Name</th>
              <th>Payment Amount</th>
              <th>Payment Date</th>
              <th>Balance Due</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan="7">No payments found.</td></tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.payment_ID}>
                  {/* Using Client ID as CLI00X format */}
                  <td>CLI{String(payment.client_ID).padStart(3, '0')}</td> 
                  <td>{payment.client_Name}</td>
                  {/* Format currency */}
                  <td>₱{payment.payment_Amount.toFixed(2)}</td> 
                  <td>{payment.payment_Date}</td>
                  {/* Highlight balance if outstanding */}
                  <td style={{ fontWeight: payment.balance > 0 ? 'bold' : 'normal', color: payment.balance > 0 ? '#E64848' : '#333' }}>
                    ₱{payment.balance.toFixed(2)}
                  </td>
                  <td>{payment.payment_Remarks}</td>
                  <td>
                    <button className="edit-payment-btn button" onClick={() => handleEdit(payment)}>Edit</button>
                    <button className="delete-payment-btn button" onClick={() => handleDelete(payment)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <EditPaymentPopup
        key={editingPayment?.payment_ID || 'new-payment-editor'}
        payment={editingPayment}
        onClose={() => setEditingPayment(null)}
        onPaymentUpdated={fetchPayments}
    />
    </div>
  );
}

export default Payments;