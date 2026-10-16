interface Props { title: string; message: string; onConfirm: () => void; onCancel: () => void }
export default function ConfirmDialog({ title, message, onConfirm, onCancel }: Props) {
  return <div className="modal d-block" role="dialog" aria-modal="true" aria-label={title} style={{ background: "rgba(0,0,0,.35)" }}>
    <div className="modal-dialog modal-dialog-centered"><div className="modal-content">
      <div className="modal-header"><h2 className="modal-title fs-5">{title}</h2><button className="btn-close" onClick={onCancel} aria-label="Close" /></div>
      <div className="modal-body">{message}</div><div className="modal-footer"><button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button><button className="btn btn-danger" onClick={onConfirm}>Confirm</button></div>
    </div></div>
  </div>;
}
