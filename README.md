# 🌾 SurpRice
<p align="center">
  <img src="https://github.com/WONGZIQI0212/vhack2026-surpRice/blob/main/src/assets/SurpRice_logo.svg" width="200" hspace="20">
</p>

## 📖 Table of Contents
- [Track & Problem Statement](#track--problem-statement-mag_right)
- [Introduction](#introduction-mega)
- [Core Features](#core-features-star2)
- [Technical Stack](#technical-stack-computer)
- [Installation](#installation-)
- [Project Structure](#project-structure-)
- [System Architecture](#system-architecture-)
- [Contributors](#contributors-)

---

## Case Study & Problem Statement :mag_right:
**Case Study:** Varsity Hackathon 2026 — Case Study 1: Predictive Maintenance for SME Resilience (SDG 9)

**Problem Statement:**
ASEAN SMEs, the backbone of the economy, operate with aging machinery and thin profit margins. Reactive maintenance (fixing after failure) and inefficient preventative maintenance (replacing parts too early) lead to costly downtime. There is an urgent need for an AI-driven system that can predict machine health, visualize issues spatially, and help managers make data‑driven operational decisions—without requiring a “smart factory” overhaul.

---

## Introduction :mega:
**SurpRice** is a **Factory Intelligence & Predictive Maintenance Platform** that transforms how SMEs understand and run their production lines. We fuse real‑time sensor data with a living 3D digital twin, so you don’t just read the factory—**you see it, live**.

Our mission is to eliminate the “black box” of machine health and turn operations into a strategic advantage. From detecting anomalies the moment they happen, to simulating future scenarios like adding a new machine or handling demand spikes, SurpRice gives factory managers the confidence to act before problems escalate.

---

## Core Features :star2:

### 1. Real‑Time Sensor Monitoring Digital Twin 🖥️🏭
- **Live 3D Visual Mapping** – Sensor data is mapped directly onto a digital twin of the factory floor.  
- **Spatial Issue Identification** – Problems are shown exactly *where* they occur, not just in a table.  
- **In‑Scene Alerts** – Critical anomalies appear as visual pulses or glowing zones inside the 3D environment.  
- *“You don’t read the factory — you see it, live.”*

### 2. Intelligent Production & Resource Optimizer ⚙️📊
Turn operational data into strategic insight. Instantly see the trade‑offs between **cost, risk, and output** with six pre‑built simulation scenarios:

| Scenario       | Purpose                              |
|----------------|--------------------------------------|
| ⚡ Max Speed    | Hit tight deadlines                  |
| 💰 Economic    | Minimize operating cost               |
| ⚖️ Balanced    | Default, risk‑aware production       |
| 🕐 Overtime    | Extra output when demand surges      |
| 📉 Lean        | Reduce waste, maximize efficiency     |
| 🚀 Surge Mode  | Extreme demand handling (emergency)   |

Each scenario updates the 3D twin and KPIs in real time, letting managers explore “what if” without touching a single machine.

### 3. Intelligent Operations Advisory 🧠➕
- **Predictive Detection** – Catch anomalies early before they escalate.
- **Actionable Steps** – Tells you *what* to maintain and *when*.
- **Cost & Downtime Savings** – Shift from reactive to **proactive** maintenance.
- **Decision Intelligence** – Not just data; AI advises the best course of action.
- *“Fix it before it fails.”*

### 4. AI‑Powered Machine Impact Simulator 📈🤖
- **Zero‑Risk Decision Testing** – Simulate the impact of adding a new machine before investing a single dollar.  
- **Live 3D Preview** – The new machine appears instantly in the digital twin, so you see exactly how it fits into your layout.  
- **Instant Feedback Sliders** – Adjust parameters and watch cost, capacity, and risk change in real time.  
- *“Every decision is tested before it becomes a risk.”*

### 5. Anomaly Diagnostics Engine 🚨🔍
- **Real‑Time Detection** – Continuously monitors sensor streams to spot deviations as they happen.
- **Full Breakdown** – For every anomaly, the system tells you:
  - **When & Where** it started
  - **Which metric** is affected (temperature, vibration, load)
  - **Severity level** (Warning vs. Critical)
- **Multi‑Channel Alerts**:
  - 3D pulse rings around the affected machine
  - Highlighted rows in data tables
  - Dedicated anomaly modal with detailed analysis
- *“We don’t just detect failures — we explain them.”*

---

## Technical Stack :computer:
- **Frontend**  
  - React + Vite  
  - JavaScript  
- **3D Visualization**  
  - Spline (interactive digital twin)  
- **Backend**  
  - Node.js  
  - Python  
- **AI Processing**  
  - Google Cloud  
  - FastAPI  

---

## Installation 🔗
```bash
git clone https://github.com/WONGZIQI0212/vhack2026-surpRice.git
cd vhack2026-surpRice
npm install
npm run dev
```
---
## Project Structure
```bash
vhack2026-surpRice/
├── public/
│   ├── vite.svg
├── src/
│   ├── assets/               # Logo, images
│   ├── components/           # Reusable UI
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── stage/
│   │   └── ui/
│   ├── context/              # AnomalyContext
│   ├── data/                 # Mock JSON data
│   ├── hooks/                # useAnomalyMode, etc.
│   ├── pages/                # Dashboard, AIAdvisor, Maintenance, ...
│   ├── styles/               # Global styles, theme
│   ├── App.css
│   ├── App.jsx
│   ├── LoginPage.jsx
│   ├── WelcomePage.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```
---
## System Architecture 🪜

![SurpRice System Architecture](https://github.com/WONGZIQI0212/vhack2026-surpRice/raw/main/src/assets/SystemArchitecture.png)

---

## Contributors 👩🏼‍💻
- Team **TBC**

      🙋🏻‍♀️Bong Zi Shan
      🙆🏻‍♀️Loh Su Ting
      🧏🏻‍♀️Wong Jia Hui
      💁🏻‍♀️Wong Zi Qi

