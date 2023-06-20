-- Create the database
CREATE DATABASE IF NOT EXISTS `santas_secret`;
USE `santas_secret`;

-- Create the 'user' table
CREATE TABLE `user` (
  `U_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(64) DEFAULT NULL,
  `first_name` VARCHAR(64) DEFAULT NULL,
  `last_name` VARCHAR(64) DEFAULT NULL,
  `visibility` ENUM('visible','hidden','unlisted') NOT NULL DEFAULT 'visible',
  `password` VARCHAR(128) NOT NULL,
  CONSTRAINT `unique_username` UNIQUE (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the 'game' table
CREATE TABLE `game` (
  `G_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `name` TEXT NOT NULL,
  `creator` INT NOT NULL,
  `max_members` INT NOT NULL,
  `stage` ENUM('paused','running','ended') NOT NULL,
  `visibility` ENUM('visible','hidden','unlisted') NOT NULL DEFAULT 'visible',
  CONSTRAINT `fk_game_creator` FOREIGN KEY (`creator`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the 'chat' table
CREATE TABLE `chat` (
  `C_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `game` INT,
  `user_giver` INT,
  `user_receiver` INT,
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`game`) REFERENCES `game` (`G_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`user_giver`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat_ibfk_3` FOREIGN KEY (`user_receiver`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the 'message' table
CREATE TABLE `message` (
  `M_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `chat` INT,
  `sender` INT,
  `message_content` VARCHAR(255),
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`chat`) REFERENCES `chat` (`C_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`sender`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the 'user_game' table
CREATE TABLE `user_game` (
  `U_ID` INT,
  `G_ID` INT,
  CONSTRAINT `user_game_ibfk_1` FOREIGN KEY (`U_ID`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_game_ibfk_2` FOREIGN KEY (`G_ID`) REFERENCES `game` (`G_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
