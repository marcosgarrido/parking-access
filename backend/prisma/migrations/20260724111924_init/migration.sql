-- CreateEnum
CREATE TYPE "AppRole" AS ENUM ('ADMIN', 'MANAGER', 'SUPERVISOR');

-- CreateTable
CREATE TABLE "AppUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "AppRole" NOT NULL DEFAULT 'SUPERVISOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "accessAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParkingUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingUserVehicle" (
    "parkingUserId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "ParkingUserVehicle_pkey" PRIMARY KEY ("parkingUserId","vehicleId")
);

-- CreateTable
CREATE TABLE "Timeshift" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "parkingUserId" INTEGER NOT NULL,

    CONSTRAINT "Timeshift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "reasonForDenial" TEXT,
    "vehiclePlate" TEXT,
    "parkingUserId" INTEGER,
    "parkingUserName" TEXT NOT NULL DEFAULT 'Desconocido',
    "parkingUserSurname" TEXT,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_username_key" ON "AppUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingUser_telephone_key" ON "ParkingUser"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- AddForeignKey
ALTER TABLE "ParkingUserVehicle" ADD CONSTRAINT "ParkingUserVehicle_parkingUserId_fkey" FOREIGN KEY ("parkingUserId") REFERENCES "ParkingUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingUserVehicle" ADD CONSTRAINT "ParkingUserVehicle_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timeshift" ADD CONSTRAINT "Timeshift_parkingUserId_fkey" FOREIGN KEY ("parkingUserId") REFERENCES "ParkingUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_parkingUserId_fkey" FOREIGN KEY ("parkingUserId") REFERENCES "ParkingUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
