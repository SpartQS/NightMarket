-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: online_magazin
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `images` varchar(1000) DEFAULT NULL,
  `all_games` int DEFAULT NULL,
  `price` float DEFAULT NULL,
  `genre` varchar(45) DEFAULT NULL,
  `publisher` varchar(45) DEFAULT NULL,
  `developer` varchar(45) DEFAULT NULL,
  `system_requirements` varchar(255) DEFAULT NULL,
  `trailer` varchar(255) DEFAULT NULL,
  `discount_percentage` int DEFAULT '0',
  `discount_expiration` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Grand Theft Auto V','Grand Theft Auto V — компьютерная игра в жанре action-adventure с открытым миром, разработанная компанией Rockstar North и изданная компанией Rockstar Games.','https://res.cloudinary.com/dpeciesty/image/upload/v1726576639/products/Grand%20Theft%20Auto%20V.jpg',15,900,'Action','Rockstar Games','Rockstar Games','Процессор: Intel Core 2 Q6600 @ 2.40 Ггц (четырехъядерный) / AMD Phenom 9850 (четырехъядерный) @ 2.5 Ггц Оперативная память: 4 GB ОЗУ Видеокарта: NVIDIA 9800 GT c 1 Гб видеопамяти/ AMD HD 4870 с 1 Гб видеопамяти (DX 10, 10.1, 11) Место на диске: 120 GB.','https://www.youtube.com/embed/QkkoHAzjnUs',10,'2024-11-21 21:24:00'),(2,'Red Dead Redemption 2','Red Dead Redemption 2 — компьютерная игра в жанрах action-adventure и шутера от третьего лица с открытым миром, разработанная Rockstar Studios.','https://res.cloudinary.com/dpeciesty/image/upload/v1726576647/products/Red%20Dead%20Redemption%202.jpg',16,1890.5,'Action','Rockstar Games','Rockstar Games','Процессор: Intel® Core™ i7-4770K / AMD Ryzen 5 1500X. Оперативная память: 12 GB ОЗУ Видеокарта: Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB. Сеть: Широкополосное подключение к интернету','https://www.youtube.com/embed/gmA6MrX81z4?si=fgEFss-C3lM0EFE2',5,'2024-11-22 20:57:00'),(4,'Call of Duty: Modern Warfare II','Call of Duty: Modern Warfare II — компьютерная игра в жанре шутера от первого лица, разработанная компанией Infinity Ward, издателем игры выступила Activision. Это сиквел Call of Duty: Modern Warfare 2019 года, а также девятнадцатая часть в серии.','https://res.cloudinary.com/dpeciesty/image/upload/v1726576663/products/Call%20of%20Duty:%20Modern%20Warfare%20II.jpg',4,2500,'Action','Ubisoft','Naughty Dog','64-разрядные процессор и операционная система','https://www.youtube.com/embed/ztjfwecrY8E?si=075DN0YxQsjRtqhc',0,NULL),(5,'Tom Clancy’s Rainbow Six','Tom Clancy’s Rainbow Six Siege — тактический шутер от первого лица, разработанный Ubisoft.','https://res.cloudinary.com/dpeciesty/image/upload/v1726576671/products/Tom%20Clancy%E2%80%99s%20Rainbow%20Six.jpg',20,1990,'Action','Ubisoft','Naughty Dog','Процессор: AMD Ryzen 3 1200 @ 3.1 GHz, Intel Core i5-4460 @ 3.2 GHz, or better. Оперативная память: 8 GB ОЗУ Видеокарта: AMD RX560 (4 GB), NVIDIA GeForce GTX 960 (4 GB), or better.ОС: Windows 10 (64-bit versions) ','https://www.youtube.com/embed/6wlvYh0h63k?si=Z38LRx2kRoaZRs_F',0,NULL);
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-25 15:08:38
