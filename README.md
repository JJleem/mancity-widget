# 🔵 Manchester City Widget

> A sleek, real-time Manchester City match schedule widget for macOS, built with [Übersicht](https://tracesof.net/uebersicht/).
>
> macOS 데스크탑에서 맨체스터 시티의 실시간 경기 일정을 보여주는 위젯입니다. [Übersicht](https://tracesof.net/uebersicht/)로 구동됩니다.

![Übersicht](https://img.shields.io/badge/Übersicht-Widget-6CABDD?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-macOS-lightgrey?style=flat-square&logo=apple)
![API](https://img.shields.io/badge/API-football--data.org-1C2C5B?style=flat-square)

---

## ✨ Features / 기능

### 🏆 Recent Form / 최근 폼 — Last 5 Matches / 최근 5경기

A row of color-coded dots gives you a quick visual summary of Manchester City's recent form at a glance.

색상 도트로 맨시티의 최근 5경기 결과를 한눈에 확인할 수 있습니다.

| Dot / 도트 | Result / 결과 |
|-----------|-------------|
| 🟢 Green / 초록 | Win / 승리 |
| 🟠 Orange / 주황 | Draw / 무승부 |
| 🔴 Red / 빨강 | Loss / 패배 |

---

### 📋 Match Timeline / 경기 타임라인 — Scroll-style Layout / 스크롤 스타일 레이아웃

The widget displays three matches in a focused, scroll-wheel-inspired layout.

위젯은 스크롤 휠 컨셉의 레이아웃으로 세 경기를 보여줍니다.

```
[ Previous Match / 직전 경기 ]  ← faded · score result / 흐리게 · 스코어 표시
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ▶ NEXT   PL                       홈
  [logo]  Arsenal
          4월 12일 (일) 오후 12:30
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ Next +1 Match / 그 다음 경기 ]  ← faded · upcoming / 흐리게 · 예정
```

- **Previous match / 직전 경기** — Dimmed card with final score chip (W/D/L) / 스코어 칩과 함께 흐릿하게 표시
- **Next match / 다음 경기** — Full-brightness focus card, large team name & date / 선명하고 크게 강조
- **Match after next / 그 다음 경기** — Dimmed card with upcoming date / 흐릿하게 날짜 미리보기

---

### 🎨 Design / 디자인

- **Glassmorphism / 글래스모피즘** — Man City sky blue translucent background with backdrop blur / 맨시티 하늘색 반투명 배경 + 블러 효과
- **Official emblems / 공식 엠블럼** — Manchester City crest in the header, opponent crests per match / 헤더에 맨시티 크레스트, 각 경기마다 상대팀 로고 표시
- **Competition logos / 대회 로고** — Real emblem icons per competition (PL, UCL, FA Cup, EFL Cup) / 대회별 실제 엠블럼 아이콘 표시
- **Live data / 실시간 데이터** — Auto-refreshes every 30 minutes / 30분마다 자동 갱신

---

## 🛠 Tech Stack / 기술 스택

| Layer / 레이어 | Details / 내용 |
|--------------|--------------|
| Widget runtime / 위젯 런타임 | [Übersicht](https://tracesof.net/uebersicht/) |
| Language / 언어 | JSX (React-like syntax) |
| Data source / 데이터 소스 | [football-data.org v4 API](https://www.football-data.org/) |
| Team ID / 팀 ID | `65` (Manchester City FC) |
| Refresh rate / 갱신 주기 | Every 30 minutes / 30분마다 |

---

## 📡 API Coverage / API 커버리지

Powered by the **football-data.org** free tier, which covers:

**football-data.org** 무료 티어 기준으로 아래 대회를 지원합니다:

- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League / 프리미어리그
- 🌍 UEFA Champions League / UEFA 챔피언스리그

> FA Cup and EFL Cup data require a paid API plan.
>
> FA컵 및 EFL컵 데이터는 유료 플랜이 필요합니다.

---

*made by molt*
