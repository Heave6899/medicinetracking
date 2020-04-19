-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2020 at 01:18 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medicine`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `NAME` varchar(255) NOT NULL,
  `UNAME` varchar(255) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `PASS` varchar(255) NOT NULL,
  `FIRST_LOG` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`NAME`, `UNAME`, `EMAIL`, `PASS`, `FIRST_LOG`) VALUES
('Swapnil', 'IBatJ', 'swapnilchadotra2227@gmail.com', '$2a$10$.gJ1yMy1jhQFWSRWGPhiUuR66wwTDmezyGRK58YywLXe5LAacNdeK', 1),
('Vansh Patel', 'vanshp', '17bit119@nirmauni.ac.in', '$2a$10$VI5LqWJgFQfRzRkKy0FkU.FCsmWk.4dwnmO7EaWaTGa27NYU8a5ku', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UNAME`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
