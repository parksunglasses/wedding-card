import { useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'

interface Props {
  data: WeddingData
  theme: Theme
}

// 페이지 진입 시 양쪽에서 문이 열리듯 드러나는 은은한 인트로
export default function DoorIntro({ data, theme }: Props) {
  const [done, setDone] = useState(false)
  if (done) return null

  const ease = [0.76, 0, 0.24, 1] as const
  const openDelay = 0.9
  const openDuration = 1.5

  const panelStyle = { background: theme.colors.bgDark }

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* 왼쪽 문 */}
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2"
        style={panelStyle}
        initial={{ x: 0 }}
        animate={{ x: '-100%' }}
        transition={{ duration: openDuration, ease, delay: openDelay }}
      />
      {/* 오른쪽 문 */}
      <motion.div
        className="absolute top-0 right-0 h-full w-1/2"
        style={panelStyle}
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        transition={{ duration: openDuration, ease, delay: openDelay }}
        onAnimationComplete={() => setDone(true)}
      />

      {/* 가운데 얇은 금색 세로선 (문틈) */}
      <motion.div
        className="absolute top-0 left-1/2 h-full"
        style={{ width: 1, background: theme.colors.accentLight, marginLeft: -0.5 }}
        initial={{ opacity: 0.8, scaleY: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: openDelay + 0.4 }}
      />

      {/* 가운데 모노그램 (살짝 비쳤다 사라짐) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ color: theme.colors.accentLight }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: [0, 1, 1, 0], y: 0 }}
        transition={{ duration: openDelay + 0.3, times: [0, 0.35, 0.7, 1] }}
      >
        <p style={{ fontFamily: theme.fonts.script || theme.fonts.heading, fontSize: '2.4rem', lineHeight: 1 }}>
          {data.groom.name.charAt(0)} &amp; {data.bride.name.charAt(0)}
        </p>
        <div className="my-3" style={{ width: 28, height: 1, background: theme.colors.accentLight, opacity: 0.6 }} />
        <p style={{ fontFamily: theme.fonts.heading, fontSize: '0.7rem', letterSpacing: '0.3em' }}>
          WEDDING INVITATION
        </p>
      </motion.div>
    </div>
  )
}
