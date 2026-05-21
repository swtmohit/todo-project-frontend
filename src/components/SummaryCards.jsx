const summaryConfig = [
  { key: 'Pending', label: 'Pending' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Done', label: 'Done' },
]

function SummaryCards({ counts, totalTasks }) {
  return (
    <section className="summary-grid row g-3">
      <article className="panel card summary-card total col">
        <span className="summary-label">Total tasks</span>
        <strong>{totalTasks}</strong>
      </article>

      {summaryConfig.map((item) => (
        <article key={item.key} className="panel card summary-card col">
          <span className="summary-label">{item.label}</span>
          <strong>{counts[item.key]}</strong>
        </article>
      ))}
    </section>
  )
}

export default SummaryCards
