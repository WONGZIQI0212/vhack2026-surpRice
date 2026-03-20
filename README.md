# 🌾 SurpRice
<p align="center">
  <img src="https://github.com/WONGZIQI0212/vhack2026-surpRice/blob/main/src/assets/SurpRice_logo.svg" width="200" hspace="20">
</p>

## Table of Contents
- [Case Study & Problem Statement](#case-study--problem-statement-)
- [Problem Statement](#-problem-statement-)
- [Introduction](#introduction-)
- [Core Features](#core-features-)
- [Technical Stack](#technical-stack-)
- [Installation](#installation-)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture-)
- [Demo Video](#demo-video-)
- [Documentation](#documentation-)
- [Future Improvements & Expansion](#-future-improvements--expansion)
- [Contributors](#contributors-)
---

## Case Study & Problem Statement :mag_right:
**Case Study:** Varsity Hackathon 2026 — Case Study 1: Predictive Maintenance for SME Resilience (SDG 9)

---

# 📌 Problem Statement 🔍

## Background

Across ASEAN, SMEs form the backbone of the economy, especially in manufacturing sectors. However, many factories still rely on **reactive or time-based maintenance**, leading to inefficiencies and unexpected disruptions.

---

## Key Challenges

### ⚠️ 1. High Cost of Downtime

Unplanned machine failures can lead to:

* Significant revenue loss
* Reduced productivity
* Expensive recovery and repair costs

In manufacturing, downtime can cost **up to hundreds of millions annually**, making it a critical business risk.

---

### 📉 2. Limited Resources in SMEs

* SMEs operate with **tight budgets and manpower constraints**
* Lack of access to advanced monitoring and analytics tools
* Difficulty in making data-driven operational decisions

---

### 📊 3. Data Without Intelligence

* Factories already collect sensor data (temperature, vibration, load)
* However, this data is often:

  * Fragmented
  * Underutilized
  * Not translated into actionable insights

---

### ⏱️ 4. Reactive Maintenance Approach

* Problems are only detected **after failure occurs**
* Preventive maintenance may replace components too early
* Leads to unnecessary cost and downtime

---

## 🎯 Problem Summary

SMEs lack an intelligent system that can **predict machine failures early, visualize factory operations clearly, and support proactive decision-making.**

---


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
# Video Presentation 🎥

Watch the video here:

🔗 **YouTube Link**
[(Link)](https://youtu.be/YDNeKUU__J0)

---

# Documentation 📄

📊 **Presentation Slides**
[(Slide Link)](https://www.canva.com/design/DAHEWY3j95c/reX1Q1pJJnlxOXl0sT6FdA/edit?utm_content=DAHEWY3j95c&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

---
# 🚀 Future Improvements & Expansion

## 🔧 1. Advanced AI & Backend Integration

* Implement full backend architecture (Node.js + FastAPI)
* Train **enhanced Remaining Useful Life (RUL) models**

  * Use public datasets (e.g., NASA CMAPSS)
  * Incorporate real factory data for higher accuracy
* Improve prediction reliability and scalability

---

## ⚙️ 2. Smart Operational Ecosystem

* **Automated Spare-Parts Marketplace**

  * Trigger part ordering when RUL falls below threshold
* **Mobile Application**

  * Real-time alerts and on-the-go approvals
* **Multi-Language Support**

  * Bahasa Melayu, Thai, Vietnamese
  * Improve accessibility for regional SMEs

---

## 📈 3. Scalable Product Expansion

* Expand deployment across SMEs in Southeast Asia
* Integrate with existing factory systems (ERP / IoT platforms)
* Enable cross-factory benchmarking and insights

---

## 🌏 Vision

To become the **default “factory intelligence” layer** for SMEs across Southeast Asia — transforming factories from reactive operations into **predictive, data-driven ecosystems.**

---

## Contributors 👩🏼‍💻
- Team **TBC**

      🙋🏻‍♀️Bong Zi Shan
      🙆🏻‍♀️Loh Su Ting
      🧏🏻‍♀️Wong Jia Hui
      💁🏻‍♀️Wong Zi Qi

