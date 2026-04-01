import { HiOutlineExclamation } from 'react-icons/hi';

function ConfirmModal({ open, title, message, confirmText, cancelText, onConfirm, onCancel, variant }) {
  if (!open) return null;

  const isDestructive = variant === 'danger';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '28px 24px', textAlign: 'center' }}>
          {/* Icon */}
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: isDestructive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(220, 38, 38, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <HiOutlineExclamation style={{
              fontSize: 26,
              color: isDestructive ? '#ef4444' : '#dc2626',
            }} />
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 8,
          }}>
            {title || 'Are you sure?'}
          </h3>

          {/* Message */}
          <p style={{
            fontSize: 14,
            color: '#a3a3a3',
            lineHeight: 1.6,
          }}>
            {message || 'This action cannot be undone.'}
          </p>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '16px 24px',
          borderTop: '1px solid #2a2a2a',
        }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
            style={{ flex: 1 }}
            onClick={onConfirm}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
