# Vinyl API

API REST (Hono + TypeScript) pour gérer des **Group** et des **Vinyls** (MongoDB + Mongoose).
Validation métier via **Zod**.

## Stack
- Node.js + TypeScript
- Hono (@hono/node-server)
- MongoDB + Mongoose
- Zod (validation)

## Installation
```bash
npm install
```

## Configuration
- creer un .env a la racine
PORT=3000
MONGO_CLUSTER=cluster0.xxxxxx.mongodb.net
MONGO_DATABASE=vinyl
MONGO_USER=your_user
MONGO_PWD=your_pass

## Lancement 
```bash
npm run dev
```

# Schéma DB (MongoDB)

## Group
- _id: ObjectId
- name: string
- genre: string
- createdAt: Date
- updatedAt: Date

## Vinyl
- _id: ObjectId
- title: string
- releaseDate: Date
- state: "NEUF" | "BON" | "USE"
- price: number (>0)
- stock: number (>=0)
- groupId: ObjectId (ref -> Group._id)
- createdAt: Date
- updatedAt: Date

Relation: 1 Group -> N Vinyls (via vinyl.groupId)
