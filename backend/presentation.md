# Backend Architecture: 3-Part Division

This document outlines the division of the backend into three distinct, scalable components for your presentation.

---

## Part 1: Security Core (Auth & RBAC)
**Purpose:** Acts as the impenetrable gateway for the application, ensuring data privacy and restricted access based on user privileges.

* **Authentication (JWT-Based):**
  * Manages secure user onboarding (Registration) and verification (Login).
  * Generates and validates JSON Web Tokens (JWT) for stateless, secure sessions.
* **Role-Based Access Control (RBAC):**
  * Middleware (`/middleware/auth.js`) that intercepts all protected requests.
  * Ensures that operations like modifying portfolios or accessing sensitive user profiles are strictly authorized.
  * Can scale to support multiple tiers (e.g., Free vs. Premium/Admin users).

---

## Part 2: Real-Time Engine (WebSockets)
**Purpose:** Handles low-latency, bidirectional communication to keep the client UI perfectly synchronized with live market events and AI interactions.

* **Live Market Streams:**
  * Pushes instantaneous stock price updates and ticker changes directly to the frontend without heavy HTTP polling.
* **Real-Time AI Chat:**
  * Streams responses from the Neural Core Advisor (Groq AI) for a snappy, conversational user experience.
* **Connection Management:**
  * Maintains persistent connections, handles disconnections seamlessly, and optimizes bandwidth for high-frequency data exchange.

---

## Part 3: Core API Services & AI Financial Engine
**Purpose:** The central "brain" of the application that manages business logic, data persistence, and external third-party integrations.

* **Data Persistence & Modeling (MongoDB):**
  * Manages the structured storage of User Profiles, User Settings, and dynamic Portfolios.
* **Third-Party API Orchestration:**
  * **Yahoo Finance Bridge:** Fetches historical market trends, technicals, and real-time quotes.
  * **Groq LLM Integration:** Powers the RAG (Retrieval-Augmented Generation) pipeline, extracting stock symbols and context to provide accurate financial insights.
* **Technical Analysis Engine:**
  * Computes complex market indicators (RSI, Moving Averages) on the fly to generate BUY/SELL/NEUTRAL signals.
