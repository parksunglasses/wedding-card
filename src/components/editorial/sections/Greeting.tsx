import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import SectionHeading from '@/components/ui/SectionHeading'
import { BotanicalLineIcon, PhoneIcon } from '@/components/ui/Icons'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Greeting({ data, theme }: Props) {
  return (
    <section id="invitation" className="invitation-section theme-bg-alt relative overflow-hidden text-center">
      <BotanicalLineIcon
        className="pointer-events-none absolute right-[-24px] top-[265px] h-48 w-24 opacity-30"
        style={{ color: theme.colors.accent }}
      />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75 }}
      >
        <SectionHeading label="Invitation" title="서로의 계절이 되어" />

        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="h-px w-8" style={{ background: theme.colors.border }} />
          <p className="font-heading text-[2rem] tracking-[0.08em]">
            {data.groom.name}
            <span className="mx-3 text-lg" style={{ color: theme.colors.accent }}>&amp;</span>
            {data.bride.name}
          </p>
          <span className="h-px w-8" style={{ background: theme.colors.border }} />
        </div>

        <div className="relative z-10 mx-auto max-w-[310px] space-y-7">
          <div className="space-y-2 text-[15px] leading-[2.05]">
            {data.greetingTitle.split('\n').map((line) => <p key={line}>{line}</p>)}
          </div>
          <div className="space-y-1 text-[13px] leading-[1.95]" style={{ color: theme.colors.textMuted }}>
            {data.greetingMessage.split('\n').map((line) => <p key={line}>{line}</p>)}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.12 }}
        className="mt-16 border-y text-[13px]"
        style={{ borderColor: theme.colors.border }}
      >
        {[
          { person: data.groom, label: '아들' },
          { person: data.bride, label: '딸' },
        ].map(({ person, label }, index) => (
          <div
            key={person.name}
            className={`flex min-h-[70px] items-center justify-between gap-3 py-4 ${index === 0 ? 'border-b' : ''}`}
            style={{ borderColor: theme.colors.border }}
          >
            <p className="text-left leading-relaxed">
              <span style={{ color: theme.colors.textMuted }}>{person.father} · {person.mother}의 {label}</span>
              <strong className="ml-2 font-medium">{person.name}</strong>
            </p>
            <a
              href={`tel:${person.phone}`}
              aria-label={`${person.name}에게 전화`}
              className="flex h-10 w-10 shrink-0 items-center justify-center"
              style={{ color: theme.colors.accent }}
            >
              <PhoneIcon className="h-[19px] w-[19px]" />
            </a>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
