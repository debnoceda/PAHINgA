import React from 'react';
import '../styles/ConfirmDeleteModal.css';
import { Icon } from '@iconify/react';
import Button from './Button';
import Card from './Card';

export default function ConfirmDeleteModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Card className="modal-box">
        <div className="modal-icon">
            <Icon icon="ic:round-delete" width="24" height="24" />
        </div>
        <p className="modal-title">Confirm Delete</p>
        <p className="modal-description small-text">
          Are you sure you want to delete this journal entry?
        </p>
        <div className="modal-actions">
          <Button className="confirm-cancel" type ='small-compact' onClick={onCancel}>Cancel</Button>
          <Button className="confirm-delete" type ='small-compact' onClick={onConfirm}>Delete</Button>
        </div>
      </Card>
    </div>
  );
}