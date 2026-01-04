# Feature Flag System

A **database-backed Feature Flag (Feature Toggle) system** that allows enabling or disabling application features at runtime using **global defaults** and **context-based overrides** (user, group, region).

This project is implemented as part of a **coding challenge**, focusing on **clean architecture**, **predictable behavior**, and **separation of concerns** rather than UI.

---

## Problem Statement

Modern applications use **feature flags** to control functionality at runtime without redeploying code.
The goal of this project is to build a **simplified feature flag system** that supports:

* Defining feature flags
* Toggling features globally
* Overriding feature behavior for specific users, groups, or regions
* Deterministic runtime evaluation

---

## Core Concepts

* **Feature Flag**: A switch to enable or disable a feature
* **Global Default**: Base ON/OFF state for all users
* **Overrides**: Rules that change behavior for specific contexts
* **Evaluation Priority**: Clear order to resolve conflicts

---

## Evaluation Priority Order

When evaluating a feature:

```
1. User Override
2. Group Override
3. Region Override
4. Global Default
```

The first matching rule determines the final state.

---

## Tech Stack

* Node.js
* TypeScript
* Express
* MongoDB
* Mongoose

---

## Project Structure

```
src/
├── schema/
│   └── feature.ts
│
├── services/
│   ├── CreateFeature.ts
│   ├── AddOverride.ts
│   ├── RemoveOverride.ts
│   ├── EvaluateFeature.ts
│   └── GetFeatures.ts
│
├── routes/
│   └── featureRoutes.ts
│
├── app.ts
└── index.ts
```

---

## Data Model

Each feature flag is stored as a single document:

```
{
  key: string,
  description: string,
  enabled: boolean,
  overrides: {
    users: Map<string, boolean>,
    groups: Map<string, boolean>,
    regions: Map<string, boolean>
  }
}
```

* Maps provide **O(1)** lookup
* Overrides are **incremental**, never destructive
* Feature-centric design avoids joins and improves performance

---

## Setup Instructions

### 1. Install Dependencies

```
npm install
```

### 2. Start MongoDB

Ensure MongoDB is running locally.

### 3. Run the Server

```
npm run dev
```

Server starts at:

```
http://localhost:8000
```

---

## API Endpoints

### Create Feature

```
POST /api/features
```

Request body:

```
{
  "key": "dark_mode",
  "description": "Enable dark UI",
  "enabled": false
}
```

---

### Get All Features

```
GET /api/features
```

---

### Get Feature by Key

```
GET /api/features/dark_mode
```

---

### Add / Update Override (UPSERT)

```
PUT /api/features/:key/overrides
```

Request body:

```
{
  "level": "user",
  "entityId": "user_123",
  "enabled": true
}
```

* `level`: user | group | region
* `entityId`: identifier provided by external systems

---

### Remove Override

```
DELETE /api/features/:key/overrides
```

Request body:

```
{
  "level": "user",
  "entityId": "user_123"
}
```

---

### Evaluate Feature

```
GET /api/features/:key/evaluate
```

Query parameters:

```
userId=user_123
groups=beta_users,internal
region=IN
```

Response:

```
{
  "enabled": true,
  "source": "user"
}
```

---

## Design Decisions

* Feature flag system does **not manage users or groups**
* Entity IDs are treated as external identifiers
* Overrides use **Map** for fast lookups
* Single-responsibility services
* Deterministic and predictable evaluation

---

## Error Handling

* Duplicate feature keys are rejected
* Missing features return 404
* Invalid override inputs return 400
* Overrides never overwrite unrelated data

---

## Status

* Core requirements implemented
* Database-backed
* Runtime evaluation supported
* Phase-2 ready (region overrides)

---

## Interview Summary

> Built a database-backed feature flag system with deterministic override evaluation, safe mutation logic, and clean API separation.
