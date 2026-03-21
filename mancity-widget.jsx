export const command = `curl -s "https://api.football-data.org/v4/teams/65/matches?status=SCHEDULED&limit=10" -H "X-Auth-Token: 6c515ab3d5154ea8ba61bea61c5a2fb8"`

export const refreshFrequency = 1800000

export const render = ({ output }) => {
  let matches = []
  try {
    const data = JSON.parse(output)
    matches = data.matches || []
  } catch (e) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <img src="https://crests.football-data.org/65.svg" style={styles.cityLogo} />
          <div>
            <div style={styles.teamName}>Manchester City</div>
            <div style={styles.subtitle}>다음 경기 일정</div>
          </div>
        </div>
        <div style={styles.error}>데이터 로딩 중...</div>
      </div>
    )
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('ko-KR', {
      month: 'long', day: 'numeric', weekday: 'short',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul'
    })
  }

  const getOpponent = (match) => match.homeTeam.id === 65 ? match.awayTeam : match.homeTeam
  const getVenue = (match) => match.homeTeam.id === 65 ? '홈' : '원정'

  const getCompStyle = (name) => {
    if (name.includes('Champions')) return { color: '#FFD700', label: 'UCL' }
    if (name.includes('FA Cup'))    return { color: '#E8503A', label: 'FA Cup' }
    if (name.includes('EFL') || name.includes('Carabao') || name.includes('League Cup'))
                                    return { color: '#A855F7', label: 'EFL Cup' }
    return { color: '#6CABDD', label: 'PL' }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="https://crests.football-data.org/65.svg" style={styles.cityLogo} />
        <div>
          <div style={styles.teamName}>Manchester City</div>
          <div style={styles.subtitle}>다음 경기 일정</div>
        </div>
      </div>

      {matches.length === 0 ? (
        <div style={styles.noMatch}>예정된 경기 없음</div>
      ) : (
        matches.map((match, i) => {
          const opponent = getOpponent(match)
          const comp = getCompStyle(match.competition.name)
          const isNext = i === 0
          return (
            <div key={i} style={isNext ? { ...styles.match, ...styles.nextMatch } : styles.match}>
              <div style={styles.matchMeta}>
                {isNext && <span style={styles.nextLabel}>▶ NEXT</span>}
                <span style={{ ...styles.compBadge, background: comp.color + '22', color: comp.color, border: `1px solid ${comp.color}55` }}>
                  {comp.label}
                </span>
                <span style={styles.venue}>{getVenue(match)}</span>
              </div>
              <div style={styles.matchRow}>
                <img src={opponent.crest} style={styles.opponentLogo} />
                <div style={styles.matchInfo}>
                  <div style={styles.opponentName}>{opponent.shortName || opponent.name}</div>
                  <div style={styles.date}>{formatDate(match.utcDate)}</div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export const className = `left: 380px; top: 16px;`

const styles = {
  container: {
    background: 'rgba(10, 18, 32, 0.9)',
    borderRadius: '16px',
    padding: '16px 18px',
    width: '300px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    color: 'white',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(108,171,221,0.25)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(108,171,221,0.1)',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '14px', paddingBottom: '12px',
    borderBottom: '1px solid rgba(108,171,221,0.15)',
  },
  cityLogo: { width: '42px', height: '42px', objectFit: 'contain' },
  teamName: { fontSize: '15px', fontWeight: '700', color: '#6CABDD', letterSpacing: '0.3px' },
  subtitle: { fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' },

  nextMatch: {
    background: 'linear-gradient(135deg, rgba(108,171,221,0.1), rgba(28,44,91,0.15))',
    border: '1px solid rgba(108,171,221,0.3)',
    borderRadius: '10px',
    marginBottom: '8px',
  },
  match: {
    padding: '9px 10px',
    marginBottom: '4px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  matchMeta: {
    display: 'flex', alignItems: 'center', gap: '6px',
    marginBottom: '7px',
  },
  nextLabel: {
    fontSize: '9px', color: '#6CABDD', fontWeight: '700', letterSpacing: '1.5px',
  },
  compBadge: {
    fontSize: '9px', fontWeight: '700', letterSpacing: '0.5px',
    padding: '1px 6px', borderRadius: '4px',
  },
  venue: {
    fontSize: '9px', color: 'rgba(255,255,255,0.35)',
    marginLeft: 'auto',
  },
  matchRow: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  opponentLogo: {
    width: '30px', height: '30px', objectFit: 'contain',
    filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
  },
  matchInfo: { flex: 1 },
  opponentName: { fontSize: '13px', fontWeight: '600', marginBottom: '2px' },
  date: { fontSize: '10px', color: 'rgba(255,255,255,0.45)' },

  noMatch: { fontSize: '12px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '12px' },
  error: { fontSize: '12px', color: 'rgba(255,255,255,0.35)', padding: '8px 0' },
}
