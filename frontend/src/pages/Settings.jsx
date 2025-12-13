import React, { useState } from 'react';
import AppNotification from './alerts/Notification';
import ConfirmationModal from './alerts/ConfirmationModal';

function Settings({ showNotification }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'delete' or 'restore'

  const [dateFormat, setDateFormat] = useState('mmddyyyy');
  const [enableEmail, setEnableEmail] = useState(true);
  const [enableSMS, setEnableSMS] = useState(true);
  const [exportType, setExportType] = useState('costumes');

  const handleSaveSettings = () => {
    showNotification("Settings saved successfully!", 'success');
  };

  const handleBackupDb = async () => {
    const result = await window.electronAPI.exportDb();
    if (result.success) {
      showNotification(result.message, 'success');
    } else {
      showNotification(`Export Failed: ${result.error || result.message}`, 'error');
    }
  };

  const handleStartRestoreDb = () => {
    setModalAction('restore');
    setShowConfirmModal(true);
  };

  const handleStartDeleteDb = () => {
    setModalAction('delete');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    const action = modalAction;
    setShowConfirmModal(false);
    setModalAction(null);

    if (action === 'delete') {
      try {
        const result = await window.electronAPI.deleteAllData();
        if (result.success) {
          showNotification("Database truncated successfully. App will restart.", 'success');
        } else {
          showNotification(`Failed to delete database: ${result.error}`, 'error');
        }
      } catch (error) {
        showNotification(`Fatal error during deletion: ${error.message}`, 'error');
      }
    }

    if (action === 'restore') {
      try {
        const result = await window.electronAPI.restoreDb();
        if (result.success) {
          showNotification("Restoring database... App will restart.", 'success');
        } else {
          showNotification(`Restore failed: ${result.error || result.message}`, 'error');
        }
      } catch (error) {
        showNotification(`Fatal error during restore: ${error.message}`, 'error');
      }
    }
  };

  const handleExport = async () => {
    showNotification(`Exporting ${exportType} data...`, 'success');
    
    const result = await window.electronAPI.exportData(exportType);
    
    if (result.success) {
      showNotification(result.message, 'success');
    } else {
      showNotification(`Export Failed: ${result.error || result.message}`, 'error');
    }
  };

  return (
    <div className="page settings">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-grid">
        {/* --- Database Management Section --- */}
        <div className="settings-section">
          <h2>Backup & Database</h2>
          <div className="settings-content">

            <div className="setting-item">
              <label>Select Data to Export:</label>
              <select value={exportType} onChange={(e) => setExportType(e.target.value)}>
                <option value="costumes">Costumes</option>
                <option value="clients">Clients</option>
                <option value="rents_history">Rent History (Full)</option>
                <option value="payments">Payment History</option>
              </select>
              <button className="backup-btn button" onClick={handleExport} style={{ marginTop: '10px' }}>
                Export to CSV
              </button>
            </div>

            <hr style={{ border: '1px solid #eee' }} />

            <div className="setting-item">
              <label>Backup Entire Database (Single File):</label>
              <button className="backup-btn button" onClick={handleBackupDb}>
                Save .db Backup
              </button>
            </div>

            <div className="setting-item">
              <label>Restore from Backup:</label>
              <button className="restore-btn button" onClick={handleStartRestoreDb}>
                Restore from .db File...
              </button>
            </div>

            <hr style={{ border: '1px solid #eee' }} />

            <div className="setting-item">
              <label>Erase All Data:</label>
              <button className="delete-db-btn button" onClick={handleStartDeleteDb} style={{ backgroundColor: '#E64848' }}>
                Delete ALL Data (Truncate)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL RENDER --- */}
      {showConfirmModal && (
        <ConfirmationModal
          message={
            modalAction === 'delete'
              ? "WARNING: This will permanently erase ALL costumes, clients, transactions, and payments. Are you sure?"
              : "WARNING: This will overwrite the current database with your backup file. The app will restart. Are you sure?"
          }
          onConfirm={handleConfirmAction}
          onCancel={() => setShowConfirmModal(false)}
          confirmText={modalAction === 'delete' ? "ERASE ALL DATA" : "RESTORE & RESTART"}
        />
      )}
    </div>
  );
}

export default Settings;