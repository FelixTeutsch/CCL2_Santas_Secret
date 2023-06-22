
CREATE TABLE `chat` (
  `C_ID` int(11) NOT NULL,
  `game` int(11) DEFAULT NULL,
  `user_giver` int(11) DEFAULT NULL,
  `user_receiver` int(11) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE `game` (
  `G_ID` int(11) NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `icon` text NOT NULL DEFAULT 'Candle',
  `creator` int(11) NOT NULL,
  `max_members` int(11) NOT NULL,
  `stage` enum('paused','running','ended') NOT NULL,
  `visibility` enum('visible','hidden','unlisted') NOT NULL DEFAULT 'visible'
);

--
-- Dumping data for table `game`
--


CREATE TABLE `message` (
  `M_ID` int(11) NOT NULL,
  `chat` int(11) NOT NULL,
  `sender` int(11) DEFAULT NULL,
  `message_content` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `U_ID` int(11) NOT NULL,
  `username` varchar(64) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `password` varchar(128) NOT NULL
);

--
-- Dumping data for table `user`
--

-- --------------------------------------------------------

--
-- Table structure for table `user_game`
--

CREATE TABLE `user_game` (
  `U_ID` int(11) DEFAULT NULL,
  `G_ID` int(11) DEFAULT NULL,
  `recipient` int(11) DEFAULT NULL
);


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
  MODIFY `C_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `G_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `M_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `U_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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

