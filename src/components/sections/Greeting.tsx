import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Greeting({ data, theme }: Props) {
  return (
    <section className="theme-bg-alt py-20 px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-heading text-xs tracking-[0.4em] theme-accent mb-12 uppercase">
          Invitation
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-12 h-px" style={{ background: theme.colors.accent + '66' }} />
          <h2 className="font-heading text-3xl theme-text leading-relaxed tracking-widest">
            {data.groom.name}<br />
            {data.bride.name}
          </h2>
          <div className="w-12 h-px" style={{ background: theme.colors.accent + '66' }} />
        </div>

        <div className="text-base leading-[2.2] theme-text space-y-6 mb-12">
          {data.greetingTitle.split('\n').map((line, idx) => {
            const firstChar = line.charAt(0)
            const rest = line.slice(1)
            return (
              <p key={idx}>
                <span className="font-bold theme-accent">{firstChar}</span>
                <span>{rest}</span>
              </p>
            )
          })}
        </div>

        <div className="text-sm leading-[2]" style={{ color: theme.colors.text + 'CC' }}>
          {data.greetingMessage.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </motion.div>

      <div className="mt-16 -mx-8 px-8 py-10 theme-bg-dark" style={{ color: theme.colors.accentLight }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4 text-sm leading-loose"
        >
          <div className="flex items-center justify-center gap-3">
            <span>{data.groom.father} · {data.groom.mother}의 아들 {data.groom.name}</span>
            <a href={`tel:${data.groom.phone}`}>📞</a>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span>{data.bride.father} · {data.bride.mother}의 딸 {data.bride.name}</span>
            <a href={`tel:${data.bride.phone}`}>📞</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
