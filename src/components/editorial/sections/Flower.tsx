import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { ChevronRightIcon } from '@/components/ui/Icons'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Flower({ data, theme }: Props) {
  if (!data.flowerLink) return null

  return (
    <section className="theme-bg px-[var(--page-gutter)] pb-20">
      <motion.a
        href={data.flowerLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex min-h-[74px] items-center justify-between gap-4 border-y"
        style={{ borderColor: theme.colors.border, color: theme.colors.text }}
      >
        <div>
          <h3 className="text-[14px] font-medium">축하 화환 보내기</h3>
          <p className="mt-1 text-[12px]" style={{ color: theme.colors.textMuted }}>
            축하의 마음을 꽃으로 전해보세요.
          </p>
        </div>
        <ChevronRightIcon className="h-5 w-5" style={{ color: theme.colors.accent }} />
      </motion.a>
    </section>
  )
}
