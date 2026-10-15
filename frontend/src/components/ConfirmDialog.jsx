function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="overlay">
      <div className="modal">
        <p>{message}</p>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
