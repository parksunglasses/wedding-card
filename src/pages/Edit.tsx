import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WeddingData, Account } from '@/types'
import { loadWeddingDataAsync, saveWeddingData } from '@/data/wedding'
import { isAuthenticated } from './EditLogin'
import { themeList, ThemeId } from '@/themes'
import ImageUploader from '@/components/ImageUploader'
import MultiImageUploader from '@/components/MultiImageUploader'

type Tab = 'basic' | 'theme' | 'content'

export default function Edit() {
  const navigate = useNavigate()
  const [data, setData] = useState<WeddingData | null>(null)
  const [tab, setTab] = useState<Tab>('basic')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/edit/login')
      return
    }
    loadWeddingDataAsync().then(setData)
  }, [navigate])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0E8]">
        <p className="font-serif text-xl italic" style={{ color: '#A68B5B' }}>Loading...</p>
      </div>
    )
  }

  const handleSave = () => {
    saveWeddingData(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePreview = () => {
    saveWeddingData(data)
    window.open('/', '_blank')
  }

  const update = (path: string, value: any) => {
    const keys = path.split('.')
    const newData = { ...data }
    let current: any = newData
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setData(newData)
  }

  const addAccount = (side: 'groom' | 'bride') => {
    const key = side === 'groom' ? 'groomAccounts' : 'brideAccounts'
    const accounts = [...data[key], { bank: '', accountNumber: '', holder: '' }]
    setData({ ...data, [key]: accounts })
  }

  const updateAccount = (side: 'groom' | 'bride', idx: number, field: keyof Account, value: string) => {
    const key = side === 'groom' ? 'groomAccounts' : 'brideAccounts'
    const accounts = [...data[key]]
    accounts[idx] = { ...accounts[idx], [field]: value }
    setData({ ...data, [key]: accounts })
  }

  const removeAccount = (side: 'groom' | 'bride', idx: number) => {
    const key = side === 'groom' ? 'groomAccounts' : 'brideAccounts'
    const accounts = data[key].filter((_, i) => i !== idx)
    setData({ ...data, [key]: accounts })
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ color: '#2A2520' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-[#1F1B17] text-[#F5F0E8] px-5 py-4 flex items-center justify-between">
        <h1 className="font-script text-2xl" style={{ color: '#C4A574' }}>Editor</h1>
        <div className="flex items-center gap-2">
          <button onClick={handlePreview} className="text-xs px-3 py-2 rounded-lg border border-white/20">
            미리보기
          </button>
          <button onClick={handleSave} className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: '#A68B5B', color: 'white' }}>
            {saved ? '저장됨 ✓' : '저장'}
          </button>
        </div>
      </header>

      {/* 탭 */}
      <div className="sticky top-[60px] z-30 bg-[#EDE6D8] border-b border-black/10 flex">
        {(['basic', 'theme', 'content'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs uppercase tracking-wider transition-all`}
            style={tab === t ? {
              color: '#2A2520',
              borderBottom: '2px solid #A68B5B',
              background: '#F5F0E8',
            } : {
              color: '#8B7E6E',
            }}
          >
            {t === 'basic' ? '기본정보' : t === 'theme' ? '테마' : '컨텐츠'}
          </button>
        ))}
      </div>

      <div className="p-5 pb-20">
        {/* 1. 기본정보 탭 */}
        {tab === 'basic' && (
          <div className="space-y-8">
            <Section title="신랑 · Groom">
              <Field label="이름" value={data.groom.name} onChange={(v) => update('groom.name', v)} />
              <Field label="연락처" value={data.groom.phone} onChange={(v) => update('groom.phone', v)} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="아버지" value={data.groom.father} onChange={(v) => update('groom.father', v)} />
                <Field label="어머니" value={data.groom.mother} onChange={(v) => update('groom.mother', v)} />
              </div>
            </Section>

            <Section title="신부 · Bride">
              <Field label="이름" value={data.bride.name} onChange={(v) => update('bride.name', v)} />
              <Field label="연락처" value={data.bride.phone} onChange={(v) => update('bride.phone', v)} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="아버지" value={data.bride.father} onChange={(v) => update('bride.father', v)} />
                <Field label="어머니" value={data.bride.mother} onChange={(v) => update('bride.mother', v)} />
              </div>
            </Section>

            <Section title="예식 · Wedding">
              <div className="grid grid-cols-2 gap-3">
                <Field label="날짜" type="date" value={data.date} onChange={(v) => update('date', v)} />
                <Field label="시간" type="time" value={data.time} onChange={(v) => update('time', v)} />
              </div>
              <Field label="예식장명" value={data.venue} onChange={(v) => update('venue', v)} />
              <Field label="주소" value={data.address} onChange={(v) => update('address', v)} />
              <Field label="예식장 연락처" value={data.venuePhone} onChange={(v) => update('venuePhone', v)} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="위도" type="number" value={String(data.lat)} onChange={(v) => update('lat', parseFloat(v))} />
                <Field label="경도" type="number" value={String(data.lng)} onChange={(v) => update('lng', parseFloat(v))} />
              </div>
            </Section>
          </div>
        )}

        {/* 2. 테마 탭 - 미리보기 카드 */}
        {tab === 'theme' && (
          <div className="space-y-4">
            <p className="text-sm mb-4" style={{ color: '#8B7E6E' }}>
              마음에 드는 테마를 선택하세요
            </p>

            <div className="grid grid-cols-2 gap-4">
              {themeList.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => update('theme', theme.id as ThemeId)}
                  className="overflow-hidden text-left transition-all"
                  style={{
                    border: data.theme === theme.id
                      ? `2px solid ${theme.colors.accent}`
                      : `1px solid ${theme.colors.border}`,
                    background: theme.colors.bg,
                    borderRadius: '4px',
                    boxShadow: data.theme === theme.id
                      ? `0 4px 20px ${theme.colors.accent}30`
                      : '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* 미리보기 카드 */}
                  <div
                    className="aspect-[3/4] relative flex flex-col items-center justify-between py-5 px-3"
                    style={{ background: theme.colors.bg }}
                  >
                    {/* 상단 얇은 선 장식 */}
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div style={{ width: '30px', height: '1px', background: theme.colors.accent, opacity: 0.6 }} />
                      <div style={{ width: '16px', height: '1px', background: theme.colors.accentLight, opacity: 0.4 }} />
                    </div>

                    {/* 스크립트 제목 */}
                    <div className="text-center flex flex-col items-center gap-2">
                      <p style={{
                        fontFamily: theme.fonts.script || theme.fonts.heading,
                        color: theme.colors.accent,
                        fontSize: '20px',
                        lineHeight: 1.3,
                      }}>
                        Wedding
                      </p>
                      <p style={{
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.text,
                        fontSize: '9px',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        opacity: 0.7,
                      }}>
                        2026 · 12 · 19
                      </p>
                    </div>

                    {/* 이름 */}
                    <div className="text-center">
                      <p style={{
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.text,
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        fontStyle: 'italic',
                      }}>
                        박성환 · 이지영
                      </p>
                    </div>

                    {/* 하단 선 장식 */}
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div style={{ width: '16px', height: '1px', background: theme.colors.accentLight, opacity: 0.4 }} />
                      <div style={{ width: '30px', height: '1px', background: theme.colors.accent, opacity: 0.6 }} />
                    </div>

                    {/* 선택 표시 */}
                    {data.theme === theme.id && (
                      <div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ background: theme.colors.accent, fontSize: '10px' }}
                      >
                        ✓
                      </div>
                    )}
                  </div>

                  {/* 테마 이름 + 설명 */}
                  <div
                    className="px-3 py-2 border-t"
                    style={{ borderColor: theme.colors.border, background: theme.colors.bgAlt }}
                  >
                    <p style={{
                      fontFamily: theme.fonts.heading,
                      color: theme.colors.text,
                      fontSize: '12px',
                      fontWeight: 500,
                      marginBottom: '2px',
                    }}>
                      {theme.name}
                    </p>
                    <p style={{
                      color: theme.colors.textMuted,
                      fontSize: '10px',
                      lineHeight: 1.4,
                    }}>
                      {theme.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs mt-6 text-center" style={{ color: '#8B7E6E' }}>
              저장 후 미리보기로 실제 테마를 확인하세요
            </p>
          </div>
        )}

        {/* 3. 컨텐츠 탭 */}
        {tab === 'content' && (
          <div className="space-y-8">
            <Section title="인사말">
              <TextArea label="굵게 표시될 인사말 (각 줄 첫 글자가 강조됨)"
                value={data.greetingTitle} onChange={(v) => update('greetingTitle', v)} rows={5} />
              <TextArea label="추가 메시지"
                value={data.greetingMessage} onChange={(v) => update('greetingMessage', v)} rows={4} />
            </Section>

            <Section title="메인 사진">
              <ImageUploader
                label="인트로에 표시될 메인 사진"
                value={data.mainPhoto}
                onChange={(v) => update('mainPhoto', v)}
                aspectRatio="3/4"
              />
            </Section>

            <Section title="갤러리 사진">
              <MultiImageUploader
                label="갤러리에 표시될 사진"
                value={data.galleryPhotos}
                onChange={(v) => update('galleryPhotos', v)}
                maxCount={20}
              />
            </Section>

            <Section title="교통편">
              <TextArea label="지하철" value={data.subway} onChange={(v) => update('subway', v)} rows={3} />
              <TextArea label="버스" value={data.bus} onChange={(v) => update('bus', v)} rows={3} />
              <Field label="주차 안내" value={data.parking} onChange={(v) => update('parking', v)} />
            </Section>

            <Section title="계좌번호 - 신랑측">
              {data.groomAccounts.map((acc, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border space-y-2" style={{ borderColor: '#D9CFBE' }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs" style={{ color: '#8B7E6E' }}>계좌 {idx + 1}</span>
                    <button onClick={() => removeAccount('groom', idx)} className="text-xs text-red-500">삭제</button>
                  </div>
                  <Field label="은행" value={acc.bank} onChange={(v) => updateAccount('groom', idx, 'bank', v)} />
                  <Field label="계좌번호" value={acc.accountNumber} onChange={(v) => updateAccount('groom', idx, 'accountNumber', v)} />
                  <Field label="예금주" value={acc.holder} onChange={(v) => updateAccount('groom', idx, 'holder', v)} />
                </div>
              ))}
              <button onClick={() => addAccount('groom')} className="w-full py-2 text-sm border border-dashed rounded-lg"
                style={{ color: '#A68B5B', borderColor: '#A68B5B' }}>
                + 계좌 추가
              </button>
            </Section>

            <Section title="계좌번호 - 신부측">
              {data.brideAccounts.map((acc, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border space-y-2" style={{ borderColor: '#D9CFBE' }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs" style={{ color: '#8B7E6E' }}>계좌 {idx + 1}</span>
                    <button onClick={() => removeAccount('bride', idx)} className="text-xs text-red-500">삭제</button>
                  </div>
                  <Field label="은행" value={acc.bank} onChange={(v) => updateAccount('bride', idx, 'bank', v)} />
                  <Field label="계좌번호" value={acc.accountNumber} onChange={(v) => updateAccount('bride', idx, 'accountNumber', v)} />
                  <Field label="예금주" value={acc.holder} onChange={(v) => updateAccount('bride', idx, 'holder', v)} />
                </div>
              ))}
              <button onClick={() => addAccount('bride')} className="w-full py-2 text-sm border border-dashed rounded-lg"
                style={{ color: '#A68B5B', borderColor: '#A68B5B' }}>
                + 계좌 추가
              </button>
            </Section>

            <Section title="기타">
              <Field label="축하 화환 링크" value={data.flowerLink} onChange={(v) => update('flowerLink', v)}
                placeholder="https://... (비워두면 표시 안됨)" />
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-serif text-base italic mb-3 tracking-wide" style={{ color: '#A68B5B' }}>
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

interface FieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}

function Field({ label, value, onChange, type = 'text', placeholder }: FieldProps) {
  return (
    <div>
      <label className="text-xs mb-1 block" style={{ color: '#8B7E6E' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-white border text-sm focus:outline-none"
        style={{ borderColor: '#D9CFBE' }}
      />
    </div>
  )
}

interface TextAreaProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}

function TextArea({ label, value, onChange, rows = 3 }: TextAreaProps) {
  return (
    <div>
      <label className="text-xs mb-1 block" style={{ color: '#8B7E6E' }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-white border text-sm focus:outline-none resize-none"
        style={{ borderColor: '#D9CFBE' }}
      />
    </div>
  )
}
