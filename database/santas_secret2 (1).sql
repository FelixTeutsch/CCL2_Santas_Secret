-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 21, 2023 at 02:09 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `santas_secret2`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `C_ID` int(11) NOT NULL,
  `game` int(11) DEFAULT NULL,
  `user_giver` int(11) DEFAULT NULL,
  `user_receiver` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `G_ID` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `creator` int(11) NOT NULL,
  `max_members` int(11) NOT NULL,
  `stage` enum('paused','running','ended') NOT NULL,
  `visibility` enum('visible','hidden','unlisted') NOT NULL DEFAULT 'visible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`G_ID`, `name`, `description`, `creator`, `max_members`, `stage`, `visibility`) VALUES
(8, 'Joni\'s Game', '', 9, 12, 'running', 'visible'),
(9, 'Felix\'s Game', '', 8, 52, 'ended', 'unlisted'),
(10, 'Game', '', 9, 12, 'paused', 'hidden'),
(11, 'Test', '', 9, 12, 'paused', 'visible');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `M_ID` int(11) NOT NULL,
  `chat` int(11) DEFAULT NULL,
  `sender` int(11) DEFAULT NULL,
  `message_content` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `U_ID` int(11) NOT NULL,
  `username` varchar(64) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `visibility` enum('visible','hidden','unlisted') NOT NULL DEFAULT 'visible',
  `password` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`U_ID`, `username`, `first_name`, `last_name`, `visibility`, `password`) VALUES
(8, 'Felix', 'Felix', 'Teutsch', 'visible', '$2b$10$g065nkQgY56EAXQZl05TA.JFm3esamcrA7xcoPc1C3q0D1xZO5atG'),
(9, 'Joni', 'Jonathan', 'Teutsch', 'visible', '$2b$10$8pSH6trYv6iGpHGbS8IWHOoRDxO.oB72nETKFuDDApr/fX9UGauSS');

-- --------------------------------------------------------

--
-- Table structure for table `user_game`
--

CREATE TABLE `user_game` (
  `U_ID` int(11) DEFAULT NULL,
  `G_ID` int(11) DEFAULT NULL,
  `recipient` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_game`
--

INSERT INTO `user_game` (`U_ID`, `G_ID`, `recipient`) VALUES
(8, 9, NULL),
(9, 9, NULL),
(9, 8, NULL),
(9, 10, NULL),
(9, 11, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`C_ID`),
  ADD KEY `chat_ibfk_1` (`game`),
  ADD KEY `chat_ibfk_2` (`user_giver`),
  ADD KEY `chat_ibfk_3` (`user_receiver`);

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`G_ID`),
  ADD KEY `fk_game_creator` (`creator`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`M_ID`),
  ADD KEY `message_ibfk_1` (`chat`),
  ADD KEY `message_ibfk_2` (`sender`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`U_ID`),
  ADD UNIQUE KEY `unique_username` (`username`);

--
-- Indexes for table `user_game`
--
ALTER TABLE `user_game`
  ADD UNIQUE KEY `user_game_unique` (`U_ID`,`G_ID`),
  ADD UNIQUE KEY `user_game_unique_recipient` (`recipient`,`G_ID`),
  ADD KEY `user_game_ibfk_2` (`G_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `C_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `G_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `M_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `U_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`game`) REFERENCES `game` (`G_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`user_giver`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chat_ibfk_3` FOREIGN KEY (`user_receiver`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `game`
--
ALTER TABLE `game`
  ADD CONSTRAINT `fk_game_creator` FOREIGN KEY (`creator`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`chat`) REFERENCES `chat` (`C_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`sender`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_game`
--
ALTER TABLE `user_game`
  ADD CONSTRAINT `user_game_ibfk_1` FOREIGN KEY (`U_ID`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_game_ibfk_2` FOREIGN KEY (`G_ID`) REFERENCES `game` (`G_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_game_ibfk_3` FOREIGN KEY (`recipient`) REFERENCES `user` (`U_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
