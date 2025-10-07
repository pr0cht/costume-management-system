function Settings() {
  return (
    <div className="page settings">
      <h1 className="settings-title">Settings</h1>
      
      <div className="settings-grid">
        {/* Appearance Section */}
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Theme</label>
              <select defaultValue="light">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Accent Color</label>
              <select defaultValue="red">
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Font Size</label>
              <select defaultValue="medium">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="settings-section">
          <h2>System Preferences</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Currency</label>
              <select defaultValue="php">
                <option value="php">Philippine Peso (₱)</option>
                <option value="usd">US Dollar ($)</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Date Format</label>
              <select defaultValue="mmddyyyy">
                <option value="mmddyyyy">MM/DD/YYYY</option>
                <option value="ddmmyyyy">DD/MM/YYYY</option>
                <option value="yyyymmdd">YYYY/MM/DD</option>
              </select>
            </div>
            <div className="setting-item checkbox">
              <label>
                <input type="checkbox" defaultChecked />
                Enable Email Notifications
              </label>
            </div>
            <div className="setting-item checkbox">
              <label>
                <input type="checkbox" defaultChecked />
                Enable SMS Notifications
              </label>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="settings-section">
          <h2>Business Information</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Business Name</label>
              <input type="text" defaultValue="Davao Cosplay Shop" />
            </div>
            <div className="setting-item">
              <label>Contact Number</label>
              <input type="tel" placeholder="+63 XXX XXX XXXX" />
            </div>
            <div className="setting-item">
              <label>Email Address</label>
              <input type="email" placeholder="contact@example.com" />
            </div>
            <div className="setting-item">
              <label>Business Address</label>
              <textarea placeholder="Enter business address"></textarea>
            </div>
          </div>
        </div>

        {/* Rental Settings */}
        <div className="settings-section">
          <h2>Rental Settings</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Default Rental Duration (Days)</label>
              <input type="number" defaultValue="3" min="1" />
            </div>
            <div className="setting-item">
              <label>Late Fee (per day)</label>
              <input type="number" defaultValue="100" min="0" />
            </div>
            <div className="setting-item checkbox">
              <label>
                <input type="checkbox" defaultChecked />
                Require Deposit
              </label>
            </div>
            <div className="setting-item">
              <label>Default Deposit Amount</label>
              <input type="number" defaultValue="1000" min="0" />
            </div>
          </div>
        </div>

        {/* Backup & Security */}
        <div className="settings-section">
          <h2>Backup & Security</h2>
          <div className="settings-content">
            <div className="setting-item">
              <label>Auto-Backup Frequency</label>
              <select defaultValue="daily">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="setting-item">
              <button className="backup-btn">Backup Now</button>
              <button className="restore-btn">Restore Data</button>
            </div>
            <div className="setting-item">
              <label>Change Password</label>
              <button className="password-btn">Update Password</button>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="settings-section">
          <h2>User Management</h2>
          <div className="settings-content">
            <div className="setting-item">
              <button className="users-btn">Manage Users</button>
            </div>
            <div className="setting-item">
              <button className="roles-btn">Manage Roles</button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-settings">Save Changes</button>
        <button className="reset-settings">Reset to Default</button>
      </div>
    </div>
  );
}

import React from 'react';
export default Settings;