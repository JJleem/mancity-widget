export const command = `
  F=$(curl -s "https://api.football-data.org/v4/teams/65/matches?status=FINISHED&limit=5" -H "X-Auth-Token: 6c515ab3d5154ea8ba61bea61c5a2fb8");
  S=$(curl -s "https://api.football-data.org/v4/teams/65/matches?status=SCHEDULED&limit=2" -H "X-Auth-Token: 6c515ab3d5154ea8ba61bea61c5a2fb8");
  echo "{\\"f\\":$F,\\"s\\":$S}"
`

export const refreshFrequency = 1800000

export const render = ({ output }) => {
  let finished = []
  let scheduled = []
  try {
    const data = JSON.parse(output)
    finished  = data.f?.matches || []
    scheduled = data.s?.matches || []
  } catch (e) {
    return <div style={s.container}><Header dots={[]} /><div style={s.error}>데이터 로딩 중...</div></div>
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
    if (name.includes('Champions')) return { color: '#FFD700', label: 'UCL' }
    if (name.includes('FA Cup'))    return { color: '#E8503A', label: 'FA Cup' }
    if (name.includes('EFL') || name.includes('Carabao') || name.includes('League Cup'))
                                    return { color: '#A855F7', label: 'EFL Cup' }
    return { color: '#ffffff', label: 'PL' }
  }

  // 최근 5경기 도트 (오래된 순 → 최근 순)
  const dots = finished.map((m) => {
    const r = getResult(m)
    if (!r) return '#888'
    return r.outcome === 'W' ? '#4ADE80' : r.outcome === 'L' ? '#F87171' : '#FB923C'
  })

  return (
    <div style={s.container}>
      <Header dots={dots} />

      <div style={s.scroll}>
        {/* 직전 경기 — 흐리게 */}
        {prev && (() => {
          const opp    = getOpponent(prev)
          const result = getResult(prev)
          const comp   = getComp(prev.competition.name)
          return (
            <div style={s.dimCard}>
              <div style={s.dimMeta}>
                <CompBadge comp={comp} emblem={prev.competition.emblem} />
                <span style={s.dimVenue}>{getVenue(prev)}</span>
              </div>
              <div style={s.dimRow}>
                <img src={opp.crest} style={s.dimLogo} />
                <div style={s.dimInfo}>
                  <span style={s.dimName}>{opp.shortName || opp.name}</span>
                  {result && (
                    <span style={{ ...s.resultChip, color: result.color, border: `1px solid ${result.color}55`, background: result.color + '18' }}>
                      {result.outcome} {result.cityScore}:{result.oppScore}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {prev && <div style={s.divider} />}

        {/* 다음 경기 — 선명하게 */}
        {next ? (() => {
          const opp  = getOpponent(next)
          const comp = getComp(next.competition.name)
          return (
            <div style={s.focusCard}>
              <div style={s.focusMeta}>
                <span style={s.nextLabel}>▶ NEXT</span>
                <CompBadge comp={comp} emblem={next.competition.emblem} />
                <span style={s.focusVenue}>{getVenue(next)}</span>
              </div>
              <div style={s.focusRow}>
                <img src={opp.crest} style={s.focusLogo} />
                <div>
                  <div style={s.focusName}>{opp.shortName || opp.name}</div>
                  <div style={s.focusDate}>{formatDate(next.utcDate)}</div>
                </div>
              </div>
            </div>
          )
        })() : <div style={s.noMatch}>예정된 경기 없음</div>}

        {after && <div style={s.divider} />}

        {/* 그 다음 경기 — 흐리게 */}
        {after && (() => {
          const opp  = getOpponent(after)
          const comp = getComp(after.competition.name)
          return (
            <div style={s.dimCard}>
              <div style={s.dimMeta}>
                <CompBadge comp={comp} emblem={after.competition.emblem} />
                <span style={s.dimVenue}>{getVenue(after)}</span>
              </div>
              <div style={s.dimRow}>
                <img src={opp.crest} style={s.dimLogo} />
                <div style={s.dimInfo}>
                  <span style={s.dimName}>{opp.shortName || opp.name}</span>
                  <span style={s.dimDate}>{formatDate(after.utcDate)}</span>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
      <div style={s.footer}>made by molt</div>
    </div>
  )
}

const Header = ({ dots }) => (
  <div>
    <div style={s.header}>
      <img src="https://crests.football-data.org/65.svg" style={s.cityLogo} />
      <div>
        <div style={s.teamName}>Manchester City</div>
        <div style={s.subtitle}>경기 일정</div>
      </div>
    </div>
    {dots.length > 0 && (
      <div style={s.dotsSection}>
        <div style={s.dotsRow}>
          <span style={s.dotsLabel}>최근 5경기</span>
          <div style={s.dots}>
            {dots.map((color, i) => (
              <span key={i} style={{ ...s.dot, background: color, boxShadow: `0 0 6px ${color}88` }} />
            ))}
          </div>
        </div>
        <div style={s.dotsLegend}>
          <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#4ADE80' }} />승</span>
          <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#FB923C' }} />무</span>
          <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#F87171' }} />패</span>
        </div>
      </div>
    )}
  </div>
)

const CompBadge = ({ comp, emblem }) => (
  <span style={s.compBadgeWrap}>
    {emblem && <img src={emblem} style={s.compEmblem} />}
    <span style={s.compLabel}>{comp.label}</span>
  </span>
)

export const className = `left: 380px; top: 16px;`

const s = {
  container: {
    background: 'rgba(28, 28, 30, 0.78)',
    borderRadius: '20px',
    padding: '16px 18px 12px',
    width: '300px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
    color: 'white',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '10px', paddingBottom: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  cityLogo: { width: '38px', height: '38px', objectFit: 'contain' },
  teamName: { fontSize: '15px', fontWeight: '600', color: '#fff', letterSpacing: '-0.3px' },
  subtitle:  { fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px', fontWeight: '400' },

  dotsSection: { marginBottom: '12px' },
  dotsRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '4px',
  },
  dotsLabel: { fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.3px', fontWeight: '500' },
  dots: { display: 'flex', gap: '5px', alignItems: 'center' },
  dot:  { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
  dotsLegend: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  legendItem: { fontSize: '8px', color: 'rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: '3px' },
  legendDot:  { width: '5px', height: '5px', borderRadius: '50%', display: 'inline-block' },
  compBadgeWrap: { display: 'inline-flex', alignItems: 'center', gap: '4px' },
  compEmblem: { width: '14px', height: '14px', objectFit: 'contain' },
  compLabel: { fontSize: '9px', fontWeight: '600', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.3px' },

  scroll: { display: 'flex', flexDirection: 'column' },

  divider: { height: '1px', background: 'rgba(255,255,255,0.07)', margin: '6px 0' },

  /* ── 흐린 카드 ── */
  dimCard:  { padding: '8px 6px', opacity: 0.45 },
  dimMeta:  { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' },
  dimRow:   { display: 'flex', alignItems: 'center', gap: '8px' },
  dimLogo:  { width: '22px', height: '22px', objectFit: 'contain', filter: 'grayscale(30%)' },
  dimInfo:  { display: 'flex', alignItems: 'center', gap: '8px' },
  dimName:  { fontSize: '11px', fontWeight: '500', color: 'rgba(255,255,255,0.85)' },
  dimDate:  { fontSize: '10px', color: 'rgba(255,255,255,0.4)' },
  dimVenue: { fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' },

  resultChip: {
    fontSize: '10px', fontWeight: '600', letterSpacing: '0.2px',
    padding: '1px 7px', borderRadius: '5px',
  },

  /* ── 포커스 카드 ── */
  focusCard: {
    padding: '12px 12px',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '14px',
  },
  focusMeta: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' },
  focusRow:  { display: 'flex', alignItems: 'center', gap: '12px' },
  focusLogo: { width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' },
  focusName: { fontSize: '17px', fontWeight: '700', marginBottom: '4px', letterSpacing: '-0.4px' },
  focusDate: { fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '400' },
  focusVenue:{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' },
  nextLabel: { fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: '1.2px' },

  badge: {
    fontSize: '9px', fontWeight: '600', letterSpacing: '0.3px',
    padding: '1px 6px', borderRadius: '4px',
  },

  noMatch: { fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '14px' },
  error:   { fontSize: '12px', color: 'rgba(255,255,255,0.3)', padding: '8px 0' },
  footer:  { fontSize: '9px', color: 'rgba(255,255,255,0.18)', textAlign: 'right', marginTop: '10px', letterSpacing: '0.4px', fontWeight: '400' },
}
