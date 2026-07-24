import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { DOODLE, DoodleHeading } from './DoodleKit'

interface Props {
  data: WeddingData
}

export default function DoodleGreeting({ data }: Props) {
  const parents = [
    { person: data.groom, label: '아들' },
    { person: data.bride, label: '딸' },
  ]

  return (
    <section id="invitation" className="px-10 pb-14 pt-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <DoodleHeading size={36} className="mb-5">
          저희, 드디어 결혼해요!
        </DoodleHeading>

        <div className="space-y-0.5 text-[15px] leading-[2.1]">
          {data.greetingTitle.split('\n').map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="mt-5 space-y-0.5 text-[13.5px] leading-[2]" style={{ color: DOODLE.inkSoft }}>
          {data.greetingMessage.split('\n').map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div
          className="mt-8 flex flex-col gap-2 pt-6 text-[14px]"
          style={{ borderTop: `1.5px dashed ${DOODLE.tan}` }}
        >
          {parents.map(({ person, label }) => (
            <div key={person.name} className="flex items-center justify-center gap-2">
              <span>
                {person.father} · {person.mother}
                <span style={{ color: DOODLE.muted }}> 의 {label} </span>
                <strong className="font-semibold">{person.name}</strong>
              </span>
              <a
                href={`tel:${person.phone}`}
                aria-label={`${person.name}에게 전화`}
                className="flex h-9 w-9 items-center justify-center text-[15px]"
                style={{ color: DOODLE.red }}
              >
                ☎
              </a>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
