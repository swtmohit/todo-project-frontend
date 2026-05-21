function EmptyState({ title, description }) {
  return (
    <div className="panel card empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
