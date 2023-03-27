# Next.js × Prisma × GraphQL で素振り
Live Demo: https://nextjs-prisma-gql-todo-demo.onrender.com/

## Description
Nextjs / Prisma / GraphQL code generator を使ったフルスタックなWebアプリケーション。下記、技術スタック一覧。

- TypeScript
- Tailwind CSS
- NextAuth.js（Auth.js）
- Apollo GraphQL
- Prettier
- ESLint
- Vitest
- React Testing Library
- GitHub Actions

## env file example
This env vars is used in render.com config.
```bash
# openssl rand -base64 32 などで発行
NEXTAUTH_SECRET=[SOMETHING-32-STRING]

# URL for Develop
NEXTAUTH_URL=http://localhost:3000

# Endpoint of GraphQL
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/api/graphql

# MailHog🐖
EMAIL_SERVER=smtp://user:password@localhost:1025
EMAIL_FROM=noreply@example.com

# Mailjet
EMAIL_SERVER=smtp://[API_KEY]:[API_SECRET]@in-v3.mailjet.com:587
EMAIL_FROM=[Your e-mail address registered with MailJet]

# DB for develop
DATABASE_URL="postgresql://user:password@localhost:5432/[YOUR-PROJECT-NAME]?schema=public"

# DB for prod
# In this case, I choiced render.com (https://render.com/)
DATABASE_URL="[Your External Datebase URL with PostgreSQL]"
```

## Docker
```bash
# start container in the background. (detach mode)
$ docker-compose up -d 

# stop container
$ docker-compose stop

# remove container
$ docker-compose rm -s -f -v
```

## Prisma

```bash
# migration and generate migation files
$ npx prisma migrate dev

# read schema and generate client libray
$ npx prisma generate

# open GUI
$ npx prisma studio
```

## Config for render.com setting
In Web-Service config, set the following command
```bash
# Build Command
$ yarn; yarn buid; npx prisma migrate deploy

# Start Command
$ yarn start -p $PORT

# 
```