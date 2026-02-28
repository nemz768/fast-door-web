import { calendarStore } from '@/stores/calendarStore';
import React, { useState, useEffect } from 'react';
import "./changeDoorLimitModal.scss"

interface ChangeDoorsLimitModalProps {
  date: string;
  frontDoorQuantity: number;
  inDoorQuantity: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangeDoorsLimitModal: React.FC<ChangeDoorsLimitModalProps> = ({
  date,
  frontDoorQuantity,
  inDoorQuantity,
  onClose,
  onSuccess,
}) => {
  const [frontValue, setFrontValue] = useState(frontDoorQuantity.toString());
  const [innerValue, setInnerValue] = useState(inDoorQuantity.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFrontValue(frontDoorQuantity.toString());
    setInnerValue(inDoorQuantity.toString());
  }, [frontDoorQuantity, inDoorQuantity]);

  const validateInput = (value: string, setValue: (val: string) => void) => {
    if (value === '') {
      setValue('0');
      return;
    }
    const cleaned = value.replace(/^0+/, '') || '0';
    setValue(cleaned);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    await calendarStore.editCalendarDate([
      {
        date,
        frontDoorQuantity: Number(frontValue),
        inDoorQuantity: Number(innerValue),
      },
    ]);

    onSuccess();
  } catch (err) {
    setError(
      err instanceof Error ? err.message : 'Неизвестная ошибка'
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="modal-overlay" onClick={onClose}>

          <span className="close-btn" onClick={onClose}>
            ✕
          </span>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="frontDoors">Входные двери:</label>
            <input
              id="frontDoors"
              type="number"
              min="0"
              step="1"
              value={frontValue}
              onChange={(e) => validateInput(e.target.value, setFrontValue)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="innerDoors">Межкомнатные двери:</label>
            <input
              id="innerDoors"
              type="number"
              min="0"
              step="1"
              value={innerValue}
              onChange={(e) => validateInput(e.target.value, setInnerValue)}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              Изменить
            </button>
        </form>
    </div>
  );
};