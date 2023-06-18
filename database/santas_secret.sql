-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2023 at 11:10 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `santas_secret`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `C_ID` varchar(32) NOT NULL,
  `game` varchar(32) DEFAULT NULL,
  `user_giver` varchar(32) DEFAULT NULL,
  `user_receiver` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `G_ID` varchar(32) NOT NULL,
  `name` text NOT NULL,
  `creator` varchar(32) NOT NULL,
  `max_members` int(11) NOT NULL,
  `stage` enum('paused','running','ended') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `M_ID` varchar(32) NOT NULL,
  `chat` varchar(32) DEFAULT NULL,
  `sender` varchar(32) DEFAULT NULL,
  `message_content` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `U_ID` varchar(32) NOT NULL,
  `username` varchar(64) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `visibility` enum('Visible','Hidden') NOT NULL DEFAULT 'Visible',
  `password` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`C_ID`),
  ADD UNIQUE KEY `unique_giver` (`game`,`user_giver`),
  ADD UNIQUE KEY `unique_receiver` (`game`,`user_giver`,`user_receiver`),
  ADD KEY `user_giver` (`user_giver`),
  ADD KEY `user_receiver` (`user_receiver`);

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
  ADD KEY `chat` (`chat`),
  ADD KEY `sender` (`sender`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`U_ID`),
  ADD UNIQUE KEY `unique_username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`game`) REFERENCES `game` (`G_ID`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`user_giver`) REFERENCES `user` (`U_ID`),
  ADD CONSTRAINT `chat_ibfk_3` FOREIGN KEY (`user_receiver`) REFERENCES `user` (`U_ID`);

--
-- Constraints for table `game`
--
ALTER TABLE `game`
  ADD CONSTRAINT `fk_game_creator` FOREIGN KEY (`creator`) REFERENCES `user` (`U_ID`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`chat`) REFERENCES `chat` (`C_ID`),
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`sender`) REFERENCES `user` (`U_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
