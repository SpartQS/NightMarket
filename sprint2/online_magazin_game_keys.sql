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
-- Table structure for table `game_keys`
--

DROP TABLE IF EXISTS `game_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_key` varchar(255) DEFAULT NULL,
  `keystatus` varchar(45) DEFAULT NULL,
  `games_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_keys_games1_idx` (`games_id`),
  CONSTRAINT `fk_keys_games1` FOREIGN KEY (`games_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_keys`
--

LOCK TABLES `game_keys` WRITE;
/*!40000 ALTER TABLE `game_keys` DISABLE KEYS */;
INSERT INTO `game_keys` VALUES (147,'ABWCW3ZTBX','inaccessible',2),(148,'MR4V43885S','inaccessible',2),(149,'AKDH50ISHX','inaccessible',2),(150,'RNAG4H4F8F','inaccessible',2),(151,'D2LE82VS3G','available',2),(152,'58EZ9L58WO','available',2),(153,'AGO755SBC8','available',2),(154,'U0T2F7Z2O3','available',2),(155,'9K0WBVSV35','available',2),(156,'CILH01M6V9','available',2),(157,'MPAHPA6UA3','available',2),(158,'I6SFKLB3XQ','available',2),(159,'HEBF37ZIIQ','available',2),(160,'8JUDWHUBNM','available',2),(161,'WT2ILJ94ZP','available',2),(162,'G3ON5N05I4','available',2),(163,'7FLSNGL2WH','available',2),(164,'7MA2API1NY','available',2),(165,'HEEE4L5H0L','available',2),(166,'5XBSMZ4JAG','available',2),(167,'AWVDAU36NR','inaccessible',4),(168,'BRHSVGOT9H','inaccessible',4),(169,'KG5GVJAHWW','inaccessible',4),(170,'CYYKCOTJCJ','inaccessible',4),(171,'TOLN6A8X3F','inaccessible',4),(172,'0ZKQRB4KVW','inaccessible',4),(173,'K7IK66XVWV','available',4),(174,'GWMLLIF5AW','available',4),(175,'PKTZ0OUY0B','available',4),(176,'1C5ZK6J3W9','available',4),(177,'2GZA7OGOT0','available',4),(178,'DJP548U6QA','available',4),(179,'1ZLZIIWQZL','available',4),(180,'DENFFMFPMS','available',4),(181,'WWM10C7OTZ','available',4),(182,'OBBQGDRF7L','available',4),(183,'SFE917FNR6','available',4),(184,'4BODI0ZZJ0','available',4),(185,'HXLK76OUDB','available',4),(186,'V5BB1L9HDH','available',4),(187,'2BTQAA1EWC','inaccessible',5),(188,'6LYJQSXE0W','available',5),(189,'TQ3MFOMUS0','available',5),(190,'JP0ON47WTW','available',5),(191,'WLS1TGTUOU','available',5),(192,'J3JSB3VD17','available',5),(193,'0E867UV00B','available',5),(194,'WAUBBZ4ZRL','available',5),(195,'3HLBS346AV','available',5),(196,'XTXKHDZYBO','available',5),(197,'FF65H9AEX9','available',5),(198,'SE8LVP37SE','available',5),(199,'64UXQRKNCX','available',5),(200,'E7AQ8MHHZ8','available',5),(201,'0ERQGQIEBI','available',5),(202,'6OIZY9YV2U','available',5),(203,'ZM8P99MVJQ','available',5),(204,'XHFX5C9GB2','available',5),(205,'QWN8A9SMI7','available',5),(206,'GM4KMXSMK3','available',5),(207,'F5BXCVEW68','inaccessible',1),(208,'OM7QUVCGEM','inaccessible',1),(209,'TK941WTG24','inaccessible',1),(210,'3QKFMI5NYK','inaccessible',1),(211,'6N7H2KSUZ0','inaccessible',1),(212,'5FTZPRRB10','available',1),(213,'48XRQBE84P','available',1),(214,'8FWX1JL34F','available',1),(215,'4XT3LIT307','available',1),(216,'UQRYI2MGWW','available',1),(217,'MO3H5CG1P3','available',1),(218,'QV266XH4VW','available',1),(219,'J59E2COBP0','available',1),(220,'T6TKSRUDGY','available',1),(221,'YZ97B6M5OM','available',1),(222,'H87RMJUFU8','available',1),(223,'DXI8R2DSE7','available',1),(224,'QLJIZP5A0I','available',1),(225,'00IX5P6ZBM','available',1),(226,'0PH533CXD7','available',1),(227,'QWN8A9SMI3','available',5);
/*!40000 ALTER TABLE `game_keys` ENABLE KEYS */;
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
