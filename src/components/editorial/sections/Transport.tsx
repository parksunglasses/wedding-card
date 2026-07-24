import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { BusIcon, CarIcon, TrainIcon } from '@/components/ui/Icons'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Transport({ data, theme }: Props) {
  const rows = [
    { label: '지하철', value: data.subway, Icon: TrainIcon },
    { label: '버스', value: data.bus.replace(/[[\]]/g, ''), Icon: BusIcon },
    { label: '주차', value: data.parking, Icon: CarIcon },
  ]

  return (
    <section className="theme-bg px-[var(--page-gutter)] pb-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.75 }}
        className="border-t"
        style={{ borderColor: theme.colors.border }}
      >
        {rows.map(({ label, value, Icon }) => (
          <div
            key={label}
            className="grid grid-cols-[34px_56px_1fr] gap-3 border-b py-6"
            style={{ borderColor: theme.colors.border }}
          >
            <Icon className="h-6 w-6" style={{ color: theme.colors.accent }} />
            <p className="pt-0.5 text-[13px] font-semibold">{label}</p>
            <div className="space-y-1.5 whitespace-pre-line text-[12px] leading-[1.75]" style={{ color: theme.colors.textMuted }}>
              {value}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
