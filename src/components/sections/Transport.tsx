import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Transport({ data, theme }: Props) {
  return (
    <section className="theme-bg py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="space-y-12 max-w-md mx-auto"
      >
        <div className="text-center">
          <div className="text-3xl mb-4">🚇</div>
          <h3 className="font-bold text-lg mb-6 theme-text">지하철 이용 시</h3>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: theme.colors.text + 'CC' }}>
            {data.subway.split('\n').map((line, idx, arr) => (
              <div key={idx}>
                <p>{line}</p>
                {idx < arr.length - 1 && (
                  <div className="my-4 border-t border-dashed" style={{ borderColor: theme.colors.text + '33' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center theme-bg-alt -mx-8 px-8 py-12">
          <div className="text-3xl mb-4">🚌</div>
          <h3 className="font-bold text-lg mb-6 theme-text">버스 이용 시</h3>
          <div className="text-sm max-w-xs mx-auto space-y-2.5">
            {data.bus.split('\n').map((raw, idx) => {
              const line = raw.trim()
              if (!line) return null

              // [가락시장 하차] 같은 안내 헤더
              if (line.startsWith('[')) {
                return (
                  <p key={idx} className="text-center font-semibold theme-text mb-3 pb-1">
                    {line.replace(/[[\]]/g, '')}
                  </p>
                )
              }

              // "간선 401, 302 ..." → 라벨 배지 + 번호
              const LABELS = ['간선', '지선', '일반', '마을', '직행', '광역', '순환', '공항', '급행', '심야']
              const label = LABELS.find((l) => line.startsWith(l))
              if (label) {
                const nums = line.slice(label.length).replace(/^[\s:·]+/, '')
                return (
                  <div key={idx} className="flex items-baseline gap-2.5 text-left">
                    <span
                      className="shrink-0 w-10 text-center py-0.5 rounded text-xs font-medium"
                      style={{ background: theme.colors.accent + '22', color: theme.colors.accent }}
                    >
                      {label}
                    </span>
                    <span className="leading-relaxed" style={{ color: theme.colors.text + 'CC' }}>
                      {nums}
                    </span>
                  </div>
                )
              }

              return (
                <p key={idx} className="text-center" style={{ color: theme.colors.text + 'CC' }}>
                  {line}
                </p>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <div className="text-3xl mb-4">🚗</div>
          <h3 className="font-bold text-lg mb-6 theme-text">자가용 이용 시</h3>
          <div className="text-sm leading-relaxed" style={{ color: theme.colors.text + 'CC' }}>
            <p className="font-semibold theme-text mb-2">[주차안내]</p>
            <p>{data.parking}</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
