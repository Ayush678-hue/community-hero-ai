# Hackathon Submission: CommunityHero AI Platform
**Tagline**: *Transforming Neighborhoods Through Real-Time AI, Civic Collaboration, and Transparent Community Action.*

---

## 1. Project Overview

### The Problem
Municipal infrastructure management is notoriously slow, non-transparent, and disconnected from the everyday experiences of citizens. When local hazards—such as dangerous potholes, overflowing garbage containers, sewage leaks, or broken streetlights—go unreported, they lead to safety risks, environmental degradation, and neighborhood decline. Traditional reporting portals are cumbersome, lack user engagement, and provide no real-time progress indicators, resulting in low resident participation.

### The Solution: CommunityHero AI
CommunityHero AI turns city operations into an **intelligent civic operating system**. It is a modern full-stack platform that empowers citizens to act as "first responders" for their communities. 
* **Snap & Analyze**: Citizens upload a photo of a hazard. An AI Computer Vision engine (YOLOv8) automatically identifies the category, confidence rate, and severity level.
* **Neighborhood Verification**: To prevent spam and abuse, nearby residents verify reports on an interactive map. Once a verification threshold is met, the issue is promoted to the authorities.
* **Workforce Dispatch**: Public works authorities receive auto-prioritized queues, assign teams, and dispatch repairs.
* **Closed-Loop AI Verification**: Authorities upload a photo of the completed repair. The system uses OpenCV visual similarity checks (SSIM) to confirm the hazard is cleared before updating status to "Resolved" and releasing citizen rewards.
* **Gamified Engagement**: Users earn Hero Points and unlock persistent profile achievements ("Civic Initiator", "Community Hero") to incentivize active neighborhood improvement.

---

## 2. Technical Architecture & Tech Stack

The platform is designed as a modular monorepo consisting of three independent, highly-optimized services:

1. **Frontend UI (Next.js 14 App Router)**:
   * Styled with a premium, luxury editorial color system (warm cream backgrounds, charcoal text, and cyan highlights).
   * Fully responsive, mobile-first design utilizing Tailwind CSS and Framer Motion microinteractions.
   * Leverages Leaflet Maps for live, boundaries-based viewport issue populating.
   * State managed via lightweight Zustand stores.
2. **Backend Gateway (Express Node.js)**:
   * Controls REST routing, JWT authentication, and MongoDB queries.
   * Employs MongoDB `2dsphere` indexes to execute spatial queries (radius searches) for nearby hazards.
   * Manages duplex Socket.IO WebSockets to push real-time alerts across active clients.
3. **AI Microservice (FastAPI + Python 3.10)**:
   * runs YOLOv8 object detection modules for instant class scoring.
   * Implements custom grayscale preprocessing and OpenCV Structural Similarity Index (SSIM) checks for before/after resolution checks.
   * NLP parsing engine filters description texts to auto-escalate priority zones (e.g. school districts or hospital lanes).

---

## 3. Core Innovation Points

* **YOLOv8 Computer Vision**: Moves civic reporting away from manual entry to instant, AI-assisted telemetry.
* **Spam-Resistant Verification**: Coordinates upvoting rules ensure only real, citizen-validated issues reach municipal queues, saving city dispatch budgets.
* **Closed-Loop Resolution Audit**: The before/after image similarity matching ensures that issues cannot be marked "Resolved" by contractors or workers without visual proof of repair.
* **Global Location Support**: Integrated OpenStreetMap Nominatim APIs allow users to search and pan the map to any street worldwide, automatically generating dynamic viewport mock metrics.

---

## 4. Setup & Running Instructions

### Traditional Setup
1. **Express Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **FastAPI AI Server**:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python app/main.py
   ```
3. **Next.js Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Compose Setup
Run this command in the project root folder to start all containers (Express, FastAPI, and MongoDB) in one click:
```bash
docker-compose up --build
```
Access the dashboard at **`http://localhost:3000`**.
