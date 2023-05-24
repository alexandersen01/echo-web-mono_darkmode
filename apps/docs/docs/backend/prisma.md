# Prisma

Prisma er en ORM (Object Relation Mapper) for TypeScript. Den lar deg definere modeller og relasjoner mellom disse modellene, og genererer automatisk en database basert på disse modellene. Prisma gjør det også nesten umulig å kjøre spørringer som ikke funker på databasen. Samtidig er det enkelt å lage migrasjoner, siden Prisma genererer de for deg.

## `prisma.schema`

Dette er filen som definerer tabellene i database. For å gjøre endringer på strukturen til databasen, må du endre denne filen.

I dette eksempelet lager vi en tabell for innlegg.

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## `@prisma/client`

`@prisma/client` er et bibliotek som genereres av Prisma. Dette biblioteket lar deg gjøre spørringer mot databasen.

```ts
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const posts = await prisma.post.findMany();
```

`.findMany()` vil returnere alle innlegg i databasen, og er det samme som `SELECT * FROM post;`.

## Migrasjoner

Når du endrer på `prisma.schema`, må du lage en migrasjon. Dette gjør du ved å kjøre `pnpm db:migrate`, da vil du få et spørsmål om navn på migrasjonen.

```sh
pnpm db:migrate
```