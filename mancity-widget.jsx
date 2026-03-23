// ─────────────────────────────────────────────
//  CONFIG — 여기서 테마를 변경하세요
//  theme: 'mac'   → macOS 네이티브 스타일
//  theme: 'city'  → 맨체스터 시티 스타일
// ─────────────────────────────────────────────
const CONFIG = {
  theme: 'mac',   // 'mac' | 'city'
}
// ─────────────────────────────────────────────

const THEMES = {
  mac: {
    container:    'rgba(28, 28, 30, 0.78)',
    border:       'rgba(255,255,255,0.08)',
    divider:      'rgba(255,255,255,0.07)',
    focusCard:    'rgba(255,255,255,0.07)',
    text:         '#ffffff',
    textSub:      'rgba(255,255,255,0.4)',
    textDim:      'rgba(255,255,255,0.85)',
    textMuted:    'rgba(255,255,255,0.3)',
    textMeta:     'rgba(255,255,255,0.5)',
    nextLabel:    'rgba(255,255,255,0.5)',
    compLabel:    'rgba(255,255,255,0.55)',
    legendColor:  'rgba(255,255,255,0.3)',
    footer:       'rgba(255,255,255,0.18)',
    noMatch:      'rgba(255,255,255,0.3)',
  },
  city: {
    container:    'rgba(26, 62, 111, 0.82)',
    border:       'rgba(108,171,221,0.25)',
    divider:      'rgba(108,171,221,0.18)',
    focusCard:    'rgba(108,171,221,0.18)',
    text:         '#ffffff',
    textSub:      'rgba(255,255,255,0.5)',
    textDim:      '#ffffff',
    textMuted:    'rgba(108,171,221,0.7)',
    textMeta:     'rgba(108,171,221,0.9)',
    nextLabel:    '#6CABDD',
    compLabel:    'rgba(108,171,221,0.85)',
    legendColor:  'rgba(108,171,221,0.6)',
    footer:       'rgba(108,171,221,0.35)',
    noMatch:      'rgba(108,171,221,0.5)',
  },
}

export const command = `
  F=$(curl -s "https://api.football-data.org/v4/teams/65/matches?status=FINISHED&limit=5" -H "X-Auth-Token: 6c515ab3d5154ea8ba61bea61c5a2fb8");
  S=$(curl -s "https://api.football-data.org/v4/teams/65/matches?status=SCHEDULED&limit=2" -H "X-Auth-Token: 6c515ab3d5154ea8ba61bea61c5a2fb8");
  echo "{\\"f\\":$F,\\"s\\":$S}"
`

export const refreshFrequency = 1800000

export const render = ({ output }) => {
  const t = THEMES[CONFIG.theme] || THEMES.mac

  let finished = []
  let scheduled = []
  try {
    const data = JSON.parse(output)
    finished  = data.f?.matches || []
    scheduled = data.s?.matches || []
  } catch (e) {
    return <div style={s(t).container}><Header dots={[]} t={t} /><div style={s(t).error}>데이터 로딩 중...</div></div>
  }

  const prev  = finished[finished.length - 1] || null
  const next  = scheduled[0] || null
  const after = scheduled[1] || null

  const formatDate = (str) => {
    const d = new Date(str)
    return d.toLocaleString('ko-KR', {
      month: 'long', day: 'numeric', weekday: 'short',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul'
    })
  }

  const getOpponent = (match) => match.homeTeam.id === 65 ? match.awayTeam : match.homeTeam
  const getVenue    = (match) => match.homeTeam.id === 65 ? '홈' : '원정'

  const getResult = (match) => {
    const ft = match.score?.fullTime
    if (!ft || ft.home == null) return null
    const cityScore = match.homeTeam.id === 65 ? ft.home : ft.away
    const oppScore  = match.homeTeam.id === 65 ? ft.away : ft.home
    const outcome   = cityScore > oppScore ? 'W' : cityScore < oppScore ? 'L' : 'D'
    const color     = outcome === 'W' ? '#4ADE80' : outcome === 'L' ? '#F87171' : '#FB923C'
    return { cityScore, oppScore, outcome, color }
  }

  const getComp = (name) => {
    if (name.includes('Champions')) return { label: 'UCL' }
    if (name.includes('FA Cup'))    return { label: 'FA Cup' }
    if (name.includes('EFL') || name.includes('Carabao') || name.includes('League Cup'))
                                    return { label: 'EFL Cup' }
    return { label: 'PL' }
  }

  const dots = finished.map((m) => {
    const r = getResult(m)
    if (!r) return '#888'
    return r.outcome === 'W' ? '#4ADE80' : r.outcome === 'L' ? '#F87171' : '#FB923C'
  })

  const st = s(t)

  return (
    <div style={st.container}>
      <Header dots={dots} t={t} />

      <div style={st.scroll}>
        {prev && (() => {
          const opp    = getOpponent(prev)
          const result = getResult(prev)
          const comp   = getComp(prev.competition.name)
          return (
            <div style={st.dimCard}>
              <div style={st.dimMeta}>
                <CompBadge comp={comp} emblem={prev.competition.emblem} t={t} />
                <span style={st.dimVenue}>{getVenue(prev)}</span>
              </div>
              <div style={st.dimRow}>
                <img src={opp.crest} style={st.dimLogo} />
                <div style={st.dimInfo}>
                  <span style={st.dimName}>{opp.shortName || opp.name}</span>
                  {result && (
                    <span style={{ ...st.resultChip, color: result.color, border: `1px solid ${result.color}55`, background: result.color + '18' }}>
                      {result.outcome} {result.cityScore}:{result.oppScore}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {prev && <div style={st.divider} />}

        {next ? (() => {
          const opp  = getOpponent(next)
          const comp = getComp(next.competition.name)
          return (
            <div style={st.focusCard}>
              <div style={st.focusMeta}>
                <span style={st.nextLabel}>▶ NEXT</span>
                <CompBadge comp={comp} emblem={next.competition.emblem} t={t} />
                <span style={st.focusVenue}>{getVenue(next)}</span>
              </div>
              <div style={st.focusRow}>
                <img src={opp.crest} style={st.focusLogo} />
                <div>
                  <div style={st.focusName}>{opp.shortName || opp.name}</div>
                  <div style={st.focusDate}>{formatDate(next.utcDate)}</div>
                </div>
              </div>
            </div>
          )
        })() : <div style={st.noMatch}>예정된 경기 없음</div>}

        {after && <div style={st.divider} />}

        {after && (() => {
          const opp  = getOpponent(after)
          const comp = getComp(after.competition.name)
          return (
            <div style={st.dimCard}>
              <div style={st.dimMeta}>
                <CompBadge comp={comp} emblem={after.competition.emblem} t={t} />
                <span style={st.dimVenue}>{getVenue(after)}</span>
              </div>
              <div style={st.dimRow}>
                <img src={opp.crest} style={st.dimLogo} />
                <div style={st.dimInfo}>
                  <span style={st.dimName}>{opp.shortName || opp.name}</span>
                  <span style={st.dimDate}>{formatDate(after.utcDate)}</span>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
      <div style={st.footer}>made by molt</div>
    </div>
  )
}

const Header = ({ dots, t }) => {
  const st = s(t)
  return (
    <div>
      <div style={st.header}>
        <img src="https://crests.football-data.org/65.svg" style={st.cityLogo} />
        <div>
          <div style={st.teamName}>Manchester City</div>
          <div style={st.subtitle}>경기 일정</div>
        </div>
      </div>
      {dots.length > 0 && (
        <div style={st.dotsSection}>
          <div style={st.dotsRow}>
            <span style={st.dotsLabel}>최근 5경기</span>
            <div style={st.dots}>
              {dots.map((color, i) => (
                <span key={i} style={{ ...st.dot, background: color, boxShadow: `0 0 6px ${color}88` }} />
              ))}
            </div>
          </div>
          <div style={st.dotsLegend}>
            <span style={st.legendItem}><span style={{ ...st.legendDot, background: '#4ADE80' }} />승</span>
            <span style={st.legendItem}><span style={{ ...st.legendDot, background: '#FB923C' }} />무</span>
            <span style={st.legendItem}><span style={{ ...st.legendDot, background: '#F87171' }} />패</span>
          </div>
        </div>
      )}
    </div>
  )
}

const CompBadge = ({ comp, emblem, t }) => {
  const st = s(t)
  return (
    <span style={st.compBadgeWrap}>
      {emblem && <img src={emblem} style={st.compEmblem} />}
      <span style={st.compLabel}>{comp.label}</span>
    </span>
  )
}

export const className = `left: 380px; top: 16px;`

const s = (t) => ({
  container: {
    background: t.container,
    borderRadius: '20px',
    padding: '16px 18px 12px',
    width: '300px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
    color: t.text,
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: `1px solid ${t.border}`,
    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '10px', paddingBottom: '10px',
    borderBottom: `1px solid ${t.divider}`,
  },
  cityLogo: { width: '38px', height: '38px', objectFit: 'contain' },
  teamName: { fontSize: '15px', fontWeight: '600', color: t.text, letterSpacing: '-0.3px' },
  subtitle:  { fontSize: '10px', color: t.textSub, marginTop: '2px', fontWeight: '400' },

  dotsSection: { marginBottom: '12px' },
  dotsRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '4px',
  },
  dotsLabel: { fontSize: '9px', color: t.textMuted, letterSpacing: '0.3px', fontWeight: '500' },
  dots: { display: 'flex', gap: '5px', alignItems: 'center' },
  dot:  { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
  dotsLegend: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  legendItem: { fontSize: '8px', color: t.legendColor, display: 'inline-flex', alignItems: 'center', gap: '3px' },
  legendDot:  { width: '5px', height: '5px', borderRadius: '50%', display: 'inline-block' },
  compBadgeWrap: { display: 'inline-flex', alignItems: 'center', gap: '4px' },
  compEmblem: { width: '14px', height: '14px', objectFit: 'contain' },
  compLabel: { fontSize: '9px', fontWeight: '600', color: t.compLabel, letterSpacing: '0.3px' },

  scroll: { display: 'flex', flexDirection: 'column' },
  divider: { height: '1px', background: t.divider, margin: '6px 0' },

  dimCard:  { padding: '8px 6px', opacity: 0.5 },
  dimMeta:  { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' },
  dimRow:   { display: 'flex', alignItems: 'center', gap: '8px' },
  dimLogo:  { width: '22px', height: '22px', objectFit: 'contain', filter: 'grayscale(30%)' },
  dimInfo:  { display: 'flex', alignItems: 'center', gap: '8px' },
  dimName:  { fontSize: '11px', fontWeight: '500', color: t.textDim },
  dimDate:  { fontSize: '10px', color: t.textMuted },
  dimVenue: { fontSize: '9px', color: t.textMuted, marginLeft: 'auto' },

  resultChip: {
    fontSize: '10px', fontWeight: '600', letterSpacing: '0.2px',
    padding: '1px 7px', borderRadius: '5px',
  },

  focusCard: {
    padding: '12px 12px',
    background: t.focusCard,
    borderRadius: '14px',
  },
  focusMeta: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' },
  focusRow:  { display: 'flex', alignItems: 'center', gap: '12px' },
  focusLogo: { width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' },
  focusName: { fontSize: '17px', fontWeight: '700', marginBottom: '4px', letterSpacing: '-0.4px', color: t.text },
  focusDate: { fontSize: '11px', color: t.textMeta, fontWeight: '400' },
  focusVenue:{ fontSize: '9px', color: t.textMuted, marginLeft: 'auto' },
  nextLabel: { fontSize: '9px', color: t.nextLabel, fontWeight: '600', letterSpacing: '1.2px' },

  noMatch: { fontSize: '12px', color: t.noMatch, textAlign: 'center', padding: '14px' },
  error:   { fontSize: '12px', color: t.noMatch, padding: '8px 0' },
  footer:  { fontSize: '9px', color: t.footer, textAlign: 'right', marginTop: '10px', letterSpacing: '0.4px', fontWeight: '400' },
})
