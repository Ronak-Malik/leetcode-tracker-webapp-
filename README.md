🚀 Leet'O Tracker AI
Leet'O Tracker AI is a full-stack platform that tracks LeetCode activity, analyzes user performance, and delivers automated AI-generated insights to help developers improve consistently.

🌐 Live: https://leetotracker.vercel.app/

Overview
Leet'O Tracker automates the entire feedback loop of coding practice:

Collects user problem-solving data
Stores historical performance
Analyzes trends using AI
Generates structured reports
Sends automated email updates
Provides an interactive AI mentor
Key Features
Personal performance dashboard
Weekly automated email reports
AI-generated revision plans
Interview-style AI mentor
Workflow-based automation using n8n
Historical tracking and comparison
Architecture
Frontend (Next.js) ↓ MongoDB (User Data) ↓ n8n Workflows (Automation) ↓ PostgreSQL (Reports) ↓ AI Processing (Groq LLM) ↓ Email Reports + AI Mentor (FastAPI)

AI Mentor
Routes queries based on user intent
Provides interview questions and evaluation
Generates structured revision plans
Uses user performance data for context
Automation (n8n)
Fetch user data
Store reports in PostgreSQL
Compare with previous activity
Generate AI summaries
Send email reports
Tech Stack
Frontend

Next.js
TypeScript
Tailwind CSS
NextAuth
Backend

FastAPI
LangGraph
Groq (LLaMA 3)
Automation

n8n
Database

MongoDB
PostgreSQL
How It Works
User logs in and submits LeetCode username
Dashboard displays current stats
n8n workflow runs on schedule
AI analyzes performance
User receives automated report via email
AI mentor provides on-demand guidance
Running Locally
Start MongoDB and PostgreSQL

Run the frontend (Next.js)

Start FastAPI server (AI mentor)

Run n8n and import workflow

Configure environment variables:

MONGO_URI
GROQ_API_KEY
Email/SMTP credentials
Authors
Samrat Chauhan
Ronak Malik
Summary
Leet'O Tracker AI combines tracking, analysis, and automation into a single system that helps developers improve their problem-solving performance without manual effort.
