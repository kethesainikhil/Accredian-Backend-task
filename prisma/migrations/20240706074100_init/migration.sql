-- AlterTable
ALTER TABLE `refereeDetails` MODIFY `refereeEmail` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `refereeName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `refereePhoneNo` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `refererDetails` MODIFY `referrerEmail` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `referrerName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `referrerPhoneNo` VARCHAR(191) NOT NULL DEFAULT '';
