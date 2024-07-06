/*
  Warnings:

  - You are about to drop the `referDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `referDetails`;

-- CreateTable
CREATE TABLE `refererDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referrerEmail` VARCHAR(191) NOT NULL,
    `referrerName` VARCHAR(191) NOT NULL,
    `referrerPhoneNo` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `refererDetails_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refereeDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referedBy` INTEGER NOT NULL,
    `refereeEmail` VARCHAR(191) NOT NULL,
    `refereeName` VARCHAR(191) NOT NULL,
    `refereePhoneNo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refereeDetails` ADD CONSTRAINT `refereeDetails_referedBy_fkey` FOREIGN KEY (`referedBy`) REFERENCES `refererDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
