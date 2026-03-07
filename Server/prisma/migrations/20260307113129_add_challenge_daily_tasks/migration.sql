-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "dailyTasks" TEXT[],
ADD COLUMN     "isRepetitive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "ChallengeProgress" ADD COLUMN     "completedTaskDates" TIMESTAMP(3)[],
ADD COLUMN     "lastLogDate" TIMESTAMP(3);
