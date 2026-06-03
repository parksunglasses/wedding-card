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
          <div className="space-y-4 text-sm leading-relaxed whitespace-pre-line" style={{ color: theme.colors.text + 'CC' }}>
            {data.bus}
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
