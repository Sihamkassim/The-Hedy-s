-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "mpesaReceiptNumber" TEXT,
ADD COLUMN     "paidToTherapist" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "platformCommission" DOUBLE PRECISION,
ADD COLUMN     "platformCommissionRate" DOUBLE PRECISION NOT NULL DEFAULT 20,
ADD COLUMN     "therapistAmount" DOUBLE PRECISION,
ADD COLUMN     "therapistPayoutRef" TEXT;
