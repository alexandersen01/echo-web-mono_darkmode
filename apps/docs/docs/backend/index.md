---
sidebar_position: 1
---

# Vår backend

Backend er den delen av nettsiden som kan være litt forrvirende og vanskelig å jobbe med. Siden vi bruker NextJS så er den delt opp i flere deler.

Man finner backenden i `apps/web`, `packages/db`, `packages/api` og `packages/auth`. Her er en kort forklaring på hva de forskjellige delene gjør.

## `apps/web`

Det er her vi har NextJS sin `pages` mappe. Her ligger alle de forskjellige sidene som er på nettsiden. Det er også her vi har `pages/api` som er NextJS sin måte å lage APIer på.

Vi bruker biblioteket [tRPC](https://trpc.io/) for å lage APIene våre. Dette er en måte å lage APIer på som er enklere å bruke enn NextJS sin måte siden typene "flyter gjennom". Funksjonene som tRPC bruker er definert i `@echo-webkom/api`. Det er disse funksjonene tRPC kaller på når man bruker `useQuery` eller `useMutation` i NextJS.

## `@echo-webkom/api`

Denne pakken finner du i `packages/api`. Denne pakken er det som blir brukt av `apps/web` for å kalle på funksjoner i databasen. Denne pakken bruker `@echo-webkom/db` for å kalle på funksjoner i databasen.

## `@echo-webkom/db`

Denne pakken finner du i `packages/db`.

Dette er databasen vår. Den er skrevet i TypeScript og bruker [Prisma](https://www.prisma.io/) for å kommunisere med databasen. Databasen er skrevet i [MySQL](#). Definisjonen av databasen ligger i `packages/db/schema.prisma`. Som er prisma sin måte å definere tabeller på. Prisma genererer også TypeScript typer basert på `schema.prisma` som blir exportert i `packages/api/types`.

## `@echo-webkom/auth`

Denne pakken finner du i `packages/auth`.

Dette er biblioteket vi bruker for å håndtere innlogging. Det er skrevet i TypeScript og bruker [NextAuth](https://next-auth.js.org/) for å håndtere innloggingen. Det er også her vi har `pages/api/auth/[...nextauth].ts` som er NextJS sin måte å lage APIer på. Denne filen håndterer innloggingen til nettsiden.

Vi bruker Feide til å logge inn på nettsiden. Dette er en måte å logge inn på som er enklere for brukeren siden de ikke trenger å huske et passord, og vi trenger ikke å lagre passordene.