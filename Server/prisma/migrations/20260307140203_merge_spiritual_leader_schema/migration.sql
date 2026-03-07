/*
  Warnings:

  - A unique constraint covering the columns `[mpesaCheckoutId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pseudonym]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'paid';

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'spiritual_leader';

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_therapistId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "mpesaCheckoutId" TEXT,
ADD COLUMN     "spiritualId" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "therapistId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "pseudonym" TEXT,
ADD COLUMN     "religion" TEXT;

-- CreateTable
CREATE TABLE "SpiritualLeader" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sessionPrice" DOUBLE PRECISION NOT NULL,
    "availability" JSONB NOT NULL,
    "bio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpiritualLeader_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpiritualLeader_email_key" ON "SpiritualLeader"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_mpesaCheckoutId_key" ON "Appointment"("mpesaCheckoutId");

-- CreateIndex
CREATE UNIQUE INDEX "User_pseudonym_key" ON "User"("pseudonym");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "Therapist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_spiritualId_fkey" FOREIGN KEY ("spiritualId") REFERENCES "SpiritualLeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;
