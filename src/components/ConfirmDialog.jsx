function ConfirmDialog({ dialog, isDeleting, onCancel, onConfirm }) {
  if (!dialog) {
    return null
  }

  return (
    <div className="confirm-backdrop" role="presentation" onClick={onCancel}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="eyebrow">Confirm delete</span>
        <h2 id="confirm-title">{dialog.title}</h2>
        <p>{dialog.message}</p>
        <div className="confirm-actions">
          <button type="button" className="btn btn-outline-primary ghost-button" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger danger-button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog
