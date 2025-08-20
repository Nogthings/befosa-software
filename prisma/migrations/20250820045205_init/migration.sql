-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."AnimalStatus" AS ENUM ('IN_STOCK', 'SOLD');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "city" TEXT,
    "rfc" TEXT,
    "curp" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Animal" (
    "id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."AnimalStatus" NOT NULL DEFAULT 'IN_STOCK',
    "pen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LivestockEntry" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT,
    "guideNumber" TEXT,
    "entryFolio" TEXT NOT NULL,
    "observations" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LivestockEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LivestockEntryDetail" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LivestockEntryDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LivestockExit" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT,
    "guideNumber" TEXT,
    "exitFolio" TEXT NOT NULL,
    "observations" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LivestockExit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LivestockExitDetail" (
    "id" TEXT NOT NULL,
    "exitId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LivestockExitDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Animal_tag_key" ON "public"."Animal"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "LivestockEntry_entryFolio_key" ON "public"."LivestockEntry"("entryFolio");

-- CreateIndex
CREATE UNIQUE INDEX "LivestockEntryDetail_animalId_key" ON "public"."LivestockEntryDetail"("animalId");

-- CreateIndex
CREATE UNIQUE INDEX "LivestockEntryDetail_entryId_animalId_key" ON "public"."LivestockEntryDetail"("entryId", "animalId");

-- CreateIndex
CREATE UNIQUE INDEX "LivestockExit_exitFolio_key" ON "public"."LivestockExit"("exitFolio");

-- CreateIndex
CREATE UNIQUE INDEX "LivestockExitDetail_animalId_key" ON "public"."LivestockExitDetail"("animalId");

-- CreateIndex
CREATE UNIQUE INDEX "LivestockExitDetail_exitId_animalId_key" ON "public"."LivestockExitDetail"("exitId", "animalId");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LivestockEntry" ADD CONSTRAINT "LivestockEntry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LivestockEntryDetail" ADD CONSTRAINT "LivestockEntryDetail_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "public"."LivestockEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LivestockEntryDetail" ADD CONSTRAINT "LivestockEntryDetail_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LivestockExit" ADD CONSTRAINT "LivestockExit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LivestockExitDetail" ADD CONSTRAINT "LivestockExitDetail_exitId_fkey" FOREIGN KEY ("exitId") REFERENCES "public"."LivestockExit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LivestockExitDetail" ADD CONSTRAINT "LivestockExitDetail_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
