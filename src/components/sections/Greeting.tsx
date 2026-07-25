import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'

interface Props {
  data: WeddingData
  theme: Theme
}

function Chrys({ size = 18, color = '#D97E9F' }: { size?: number; color?: string }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ position: 'absolute', left: '-5px', top: '-5px', opacity: 0.35, pointerEvents: 'none' }} aria-hidden="true">
      <g fill={color}>
        {petals.map((rot, i) => {
          const a = (rot * Math.PI) / 180
          return <circle key={i} cx={12 + 6.5 * Math.cos(a)} cy={12 + 6.5 * Math.sin(a)} r="3" />
        })}
        <circle cx="12" cy="12" r="3.3" />
      </g>
    </svg>
  )
}

export default function Greeting({ data, theme }: Props) {
  return (
    <section className="py-12 px-8 text-center" style={{ background: '#FCFBF7' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-heading text-xs tracking-[0.4em] theme-accent mb-10 uppercase">
          Invitation
        </p>

        {/* 1. 날짜 및 시간 */}
        <div className="mb-10 text-center">
          <h3 className="font-heading text-4xl tracking-wide mb-1.5 flex items-center justify-center gap-2" style={{ color: theme.colors.accent }}>
            <span>2026.12.19</span>
            <span className="text-2xl font-normal opacity-90">(토)</span>
          </h3>
          <p className="font-heading text-2xl font-medium tracking-widest" style={{ color: theme.colors.accent }}>11:00 am</p>
        </div>

        {/* 2. 부모님 성함 및 장남 성환 / 장녀 지영 */}
        <div className="space-y-2.5 text-sm sm:text-base leading-relaxed mb-10" style={{ color: theme.colors.text }}>
          <p>
            {data.groom.father} · <span className="relative inline-block"><Chrys color={theme.colors.accent} />{data.groom.mother}</span>의 장남 <span className="font-semibold" style={{ color: theme.colors.accent }}>성환</span>
          </p>
          <p>
            {data.bride.father} · {data.bride.mother}의 장녀 <span className="font-semibold" style={{ color: theme.colors.accent }}>지영</span>
          </p>
        </div>

        {/* 3. 테스토와 100% 동일한 인사말 */}
        <div className="text-sm leading-relaxed space-y-2" style={{ color: theme.colors.text + 'DD' }}>
          <p>서로를 향한 믿음으로 시작해<br />이제 평생을 약속하려 합니다.</p>
          <p>저희들의 첫 시작을 함께해 주세요.</p>
        </div>
      </motion.div>
    </section>
  )
}
