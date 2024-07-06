-- CreateTable
CREATE TABLE `referDetails` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `referrerEmail` VARCHAR(191) NOT NULL,
    `referrerName` VARCHAR(191) NOT NULL,
    `referrerPhoneNo` VARCHAR(191) NOT NULL,
    `refereeEmail` VARCHAR(191) NOT NULL,
    `refereeName` VARCHAR(191) NOT NULL,
    `refereePhoneNo` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `referDetails_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
