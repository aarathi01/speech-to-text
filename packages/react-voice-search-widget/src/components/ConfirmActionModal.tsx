import React from "react";
import styles from "./ConfirmActionModal.module.css";
import { ConfirmActionModalProps } from "../types/types";

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmStyle = "danger",
}) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.buttonGroup}>
          <button
            aria-label="Cancel action"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelLabel}
          </button>
          <button
            aria-label="Confirm action"
            onClick={onConfirm}
            className={
              confirmStyle === "danger"
                ? styles.deleteButton
                : styles.applyButton
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
