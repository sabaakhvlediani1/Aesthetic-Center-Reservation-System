# Aesthetic Center Reservation System

A full-stack MVP reservation system for an aesthetic / beauty center.

The system allows managing specialists, services, and reservations in a time-based schedule view.

This project was built as part of a **Full-Stack Developer Test Project**.

---

# Tech Stack

## Frontend
- React.js

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL

---

# Features

# 1. Schedule Page

The main page displays a **time-based calendar**.

### Layout
- Columns → Specialists
- Rows → Time slots (30-minute intervals)
- One selected date at a time

---

# Creating a Reservation

User clicks a specialist + time slot.

A modal opens with:

- Date (pre-filled)
- Start time (pre-filled)
- Specialist (pre-filled)
- Duration
- Services (searchable, multiple selection)

After clicking **Save**:

- Reservation is stored in the database
- Reservation appears immediately on the schedule

---

# Reservation Display

Each reservation block shows:

- Main service name
- Additional services (bulleted list)
- Time range (example: `08:30 – 09:30`)
- Specialist short name

### Color Logic

Reservation color is taken from **the first selected service**.

---

# Editing a Reservation

Clicking a reservation opens the same modal used for creation.

Pre-filled fields:

- Date
- Start time
- Specialist
- Duration
- Selected services

Saving updates the reservation immediately.

---

# Deleting a Reservation

The reservation modal includes a **Delete** button.

Delete flow:

1. Click Delete
2. Confirmation dialog
3. Reservation removed from database
4. Reservation removed from schedule

---

# Drag & Drop Reservations

Reservations can be dragged to:

- Another time slot
- Another specialist column

On drop the system updates:

- `specialistId`
- `startTime`
- `endTime`

Rules:

- Reservations snap to **30-minute grid**
- Overlapping reservations for the same specialist are **not allowed**
- If conflict happens, reservation returns to original position
- Drag preview (ghost element) is shown while dragging

Changes are saved immediately to the backend.

---

# 2. Staff Page

Displays a list of specialists.

Each staff member shows:

- Profile photo
- Name
- Surname

### Features

- Search by name or surname
- Edit staff
- Delete staff

### Add / Edit Staff

Modal form contains:

- Name
- Last name
- Photo upload

The same modal is reused for editing.

---

# 3. Services Page

Manages all available services.

Each service shows:

- Color indicator
- Service name
- Price

### Features

- Search services
- Edit services
- Delete services

---

# Custom Fields (Dynamic Columns)

Users can create custom fields.

Steps:

1. Click **"+" button** in the table header
2. Enter field name
3. New column appears in services table

Custom fields also appear in **Add/Edit Service modal**.

---

# Column Ordering

Services table columns support **drag & drop ordering**.

The column order is saved and restored after page reload.

---

# Data Model Rules

- One reservation belongs to **one specialist**
- One reservation can include **multiple services**
- Reservation end time = start time + duration
- No overlapping reservations allowed for the same specialist
- Services are reusable across reservations

---

# Project Structure
frontend/
React application

backend/
Node.js Express API

database/
PostgreSQL schema

---

# Installation

## 1. Clone Repository
git clone https://github.com/sabaakhvlediani1/Aesthetic-Center-Reservation-System.git

## 2. Install Dependencies

Frontend:


cd frontend
npm install


Backend:


cd backend
npm install


---

# Environment Variables

Create `.env` file in backend:


DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=aesthetic_center


---

# Run Application

npm run dev
