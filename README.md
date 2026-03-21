# 🔵 Manchester City Widget

> A sleek, real-time Manchester City match schedule widget for macOS, built with [Übersicht](https://tracesof.net/uebersicht/).

![Übersicht](https://img.shields.io/badge/Übersicht-Widget-6CABDD?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-macOS-lightgrey?style=flat-square&logo=apple)
![API](https://img.shields.io/badge/API-football--data.org-1C2C5B?style=flat-square)

---

## ✨ Features

### 🏆 Recent Form — Last 5 Matches
A row of color-coded dots at the top gives you a quick visual summary of Manchester City's recent form at a glance.

| Dot | Result |
|-----|--------|
| 🟢 Green | Win |
| 🟠 Orange | Draw |
| 🔴 Red | Loss |

---

### 📋 Match Timeline — Scroll-style Layout

The widget displays three matches in a focused, scroll-wheel-inspired layout:

```
[ Previous Match ]   ← faded · smaller · past result + score
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ▶ NEXT   PL              홈
  [logo]  Arsenal
          4월 12일 (일) 오후 12:30
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ Next + 1 Match ]   ← faded · smaller · upcoming
```

- **Previous match** — dimmed card with final score chip (W/D/L)
- **Next match** — full-brightness focus card, large team name & date
- **Match after next** — dimmed card, upcoming date preview

---

### 🎨 Design

- **Glassmorphism** — Man City sky blue translucent background with backdrop blur
- **Official emblems** — Manchester City crest in the header, opponent crests per match
- **Competition logos** — Real emblem icons for PL, UCL, FA Cup, EFL Cup via API
- **Live data** — Auto-refreshes every 30 minutes via [football-data.org](https://www.football-data.org/) API

---

## 🛠 Tech Stack

| Layer | Details |
|-------|---------|
| Widget runtime | [Übersicht](https://tracesof.net/uebersicht/) |
| Language | JSX (React-like syntax) |
| Data source | [football-data.org v4 API](https://www.football-data.org/) |
| Team ID | `65` (Manchester City FC) |
| Refresh rate | Every 30 minutes |

---

## 📡 API Coverage

Powered by the **football-data.org** free tier, which covers:

- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
- 🌍 UEFA Champions League

> FA Cup and EFL Cup data require a paid API plan.

---

*made by molt*
