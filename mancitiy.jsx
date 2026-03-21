export const command = `curl -s "https://api.football-data.org/v4/teams/65/matches?status=SCHEDULED&limit=5" -H "X-Auth-Token: 6c515ab3d5154ea8ba61bea61c5a2fb8"`

export const refreshFrequency = 1800000

export const render = ({ output }) => {
  let matches = []
  try {
    const data = JSON.parse(output)
    matches = data.matches || []
  } catch (e) {
    return <div style={styles.container}><div style={styles.header}>🔵 Manchester City</div><div style={styles.error}>데이터 로딩 중...</div></div>
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' })
  }

  const getOpponent = (match) => match.homeTeam.id === 65 ? `vs ${match.awayTeam.name}` : `vs ${match.homeTeam.name}`
  const getVenue = (match) => match.homeTeam.id === 65 ? '홈' : '원정'

  return (
    <div style={styles.container}>
      <div style={styles.header}>🔵 Manchester City</div>
      <div style={styles.subtitle}>다음 경기 일정</div>
      {matches.length === 0 ? (
        <div style={styles.noMatch}>예정된 경기 없음</div>
      ) : (
        matches.map((match, i) => (
          <div key={i} style={i === 0 ? styles.nextMatch : styles.match}>
            {i === 0 && <div style={styles.nextLabel}>▶ NEXT</div>}
            <div style={styles.opponent}>{getOpponent(match)}</div>
            <div style={styles.info}>{formatDate(match.utcDate)} · {getVenue(match)} · {match.competition.name}</div>
          </div>
        ))
      )}
    </div>
  )
}

export const className = `left: 380px; top: 16px;`

const styles = {
  container: { background: 'rgba(10,10,20,0.82)', borderRadius: '14px', padding: '16px 20px', width: '300px', fontFamily: '-apple-system, sans-serif', color: 'white', backdropFilter: 'blur(12px)', border: '1px solid rgba(108,171,221,0.35)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' },
  header: { fontSize: '15px', fontWeight: 'bold', color: '#6CABDD', marginBottom: '2px' },
  subtitle: { fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' },
  nextMatch: { background: 'rgba(108,171,221,0.12)', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', borderLeft: '3px solid #6CABDD' },
  match: { padding: '7px 4px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '2px' },
  nextLabel: { fontSize: '9px', color: '#6CABDD', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '1.5px' },
  opponent: { fontSize: '13px', fontWeight: '600', marginBottom: '3px' },
  info: { fontSize: '10px', color: 'rgba(255,255,255,0.55)' },
  noMatch: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '10px' },
  error: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', padding: '8px 0' },
}
