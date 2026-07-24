interface Props {
  label: string
  title: string
  description?: string
  inverse?: boolean
  align?: 'left' | 'center'
}

export default function SectionHeading({
  label,
  title,
  description,
  inverse = false,
  align = 'center',
}: Props) {
  return (
    <header className={`section-heading ${align === 'left' ? 'text-left items-start' : 'text-center items-center'}`}>
      <p className="section-kicker" style={inverse ? { color: 'rgba(247, 244, 238, 0.72)' } : undefined}>
        {label}
      </p>
      <h2 style={inverse ? { color: '#F7F4EE' } : undefined}>{title}</h2>
      <span className="section-rule" aria-hidden="true" />
      {description && (
        <p
          className="section-description"
          style={inverse ? { color: 'rgba(247, 244, 238, 0.72)' } : undefined}
        >
          {description}
        </p>
      )}
    </header>
  )
}
