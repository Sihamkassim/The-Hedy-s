-- CreateEnum
CREATE TYPE "TherapistStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Therapist" ADD COLUMN     "status" "TherapistStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "termsAccepted" BOOLEAN NOT NULL DEFAULT false;
