-- CreateIndex
CREATE INDEX "Record_parkingUserId_idx" ON "Record"("parkingUserId");

-- CreateIndex
CREATE INDEX "Record_time_idx" ON "Record"("time");

-- CreateIndex
CREATE INDEX "Timeshift_parkingUserId_idx" ON "Timeshift"("parkingUserId");
