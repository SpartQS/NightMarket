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
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_data` varchar(45) DEFAULT NULL,
  `total_amount` int DEFAULT NULL,
  `order_status` varchar(45) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_user1_idx` (`user_id`),
  CONSTRAINT `fk_orders_user2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (90,'2024-10-12 14:27:17',1990,'проведен',9),(91,'2024-10-12 14:27:17',2500,'проведен',9),(92,'2024-10-12 14:29:47',1500,'проведен',9),(93,'2024-10-13 15:13:25',1990,'проведен',9),(94,'2024-10-18 10:03:56',1980,'проведен',9),(95,'2024-10-18 10:04:55',1980,'проведен',9),(96,'2024-10-18 10:14:33',1980,'проведен',9),(97,'2024-10-18 10:18:11',1980,'проведен',9),(98,'2024-10-18 10:20:17',1980,'проведен',9),(99,'2024-10-18 10:26:02',1980,'проведен',9),(100,'2024-10-18 10:26:48',1980,'проведен',9),(101,'2024-10-18 10:32:50',1980,'проведен',9),(102,'2024-10-18 10:34:54',990,'проведен',9),(103,'2024-10-18 10:37:57',1980,'проведен',9),(104,'2024-10-18 10:38:03',990,'проведен',9),(105,'2024-10-18 10:47:06',1990,'проведен',9),(106,'2024-10-18 10:48:54',990,'проведен',9),(107,'2024-10-18 10:52:09',1500,'проведен',9),(108,'2024-10-18 10:52:21',1990,'проведен',9),(109,'2024-10-18 10:52:21',2500,'проведен',9),(110,'2024-10-18 10:52:21',1500,'проведен',9),(111,'2024-10-18 10:56:59',2500,'проведен',9),(112,'2024-10-18 10:57:58',1990,'проведен',9),(113,'2024-10-18 11:02:31',1500,'проведен',9),(114,'2024-10-18 11:02:31',1990,'проведен',9),(115,'2024-10-18 11:02:31',2500,'проведен',9),(116,'2024-10-18 11:02:31',990,'проведен',9),(117,'2024-10-18 11:03:23',3000,'проведен',9),(118,'2024-10-18 11:12:22',1500,'проведен',9),(119,'2024-10-18 11:18:41',1500,'проведен',9),(120,'2024-10-18 11:21:08',1500,'проведен',9),(121,'2024-10-18 11:24:09',1990,'проведен',9),(122,'2024-10-18 11:37:57',2500,'проведен',9),(123,'2024-10-18 11:44:21',2500,'проведен',9),(124,'2024-10-18 11:47:02',2500,'проведен',9),(125,'2024-10-18 11:48:06',1500,'проведен',9),(126,'2024-10-18 11:48:06',1990,'проведен',9),(127,'2024-10-18 11:48:06',2500,'проведен',9),(128,'2024-10-18 11:48:41',1500,'проведен',9),(129,'2024-10-18 11:53:12',1500,'проведен',9),(130,'2024-10-18 11:53:32',1500,'проведен',9),(131,'2024-10-18 11:54:01',3000,'проведен',9),(132,'2024-10-21 18:24:59',1500,'проведен',9),(133,'2024-10-22 18:12:32',1990,'проведен',9),(134,'2024-10-22 18:12:32',2500,'проведен',9),(135,'2024-10-22 18:20:05',1500,'проведен',9),(136,'2024-10-22 18:27:02',1500,'проведен',9);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-29 18:57:11
