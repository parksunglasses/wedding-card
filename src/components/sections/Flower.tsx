import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Flower({ data, theme }: Props) {
  if (!data.flowerLink) return null

  return (
    <section className="theme-bg-dark py-12 px-8" style={{ color: theme.colors.bg }}>
      <motion.a
        href={data.flowerLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="block max-w-md mx-auto rounded-lg p-5"
        style={{
          background: theme.colors.bg + '1A',
          border: `1px solid ${theme.colors.bg}1A`,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold mb-1">축하 화환 보내기</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              축하의 순간, 마음을 꽃으로 전해보세요.
            </p>
          </div>
          <div className="text-4xl">💐</div>
        </div>
      </motion.a>
    </section>
  )
}
