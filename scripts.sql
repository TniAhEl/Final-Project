-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: mysql-2f43de5c-tinhalecsut-c0m5c1.g.aivencloud.com    Database: final
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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '4390cfd3-2961-11f0-a154-5afb6c732d28:1-95,
8541f3f8-07cd-11f0-8888-667c328ee254:1-51,
900f86ea-1dbd-11f0-a218-7ed443edac5b:1-260,
d910ad6c-41bc-11f0-a3e9-862ccfb054c6:1-5989,
ed87a87b-2f40-11f0-bd75-862ccfb00a63:1-263';

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `bday` date DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `role` enum('ADMIN','SUPER_ADMIN') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgfn44sntic2k93auag97juyij` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (NULL,'2025-07-23 10:51:20.986106',1,'2025-07-23 10:51:20.986106',NULL,'john1@example.com','John','Doe','$2a$10$a08vSQDlDv3MJkwopEHtoudk9CfTQ9ezGy5Yg7kS6oGeKbqH03dYa',NULL,'john_doe1','ADMIN');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `total_money` decimal(38,2) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9emlp6m95v5er2bcqkjsw48he` (`user_id`),
  CONSTRAINT `FKgol9os2lyo1m4bu3aa5rg7jyl` FOREIGN KEY (`user_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (12990000.00,1,'2025-07-23 11:12:58.207178',1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_product`
--

DROP TABLE IF EXISTS `cart_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_product` (
  `quantity` int DEFAULT NULL,
  `cart_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_option_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlv5x4iresnv4xspvomrwd8ej9` (`cart_id`),
  KEY `FKp7hedlyqk32skgas76h3ggaym` (`product_option_id`),
  CONSTRAINT `FKlv5x4iresnv4xspvomrwd8ej9` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `FKp7hedlyqk32skgas76h3ggaym` FOREIGN KEY (`product_option_id`) REFERENCES `product_option` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_product`
--

LOCK TABLES `cart_product` WRITE;
/*!40000 ALTER TABLE `cart_product` DISABLE KEYS */;
INSERT INTO `cart_product` VALUES (1,1,4,1);
/*!40000 ALTER TABLE `cart_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `bday` date DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `status` enum('ACTIVE','BANNED','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKirnrrncatp2fvw52vp45j7rlw` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (NULL,'2025-07-23 10:55:57.320676',1,'2025-07-23 10:55:57.320676',NULL,'tinhale1@example.com','tinha','le','$2a$10$ZeVyEtu75npZHl/VAJ2tceCMJlLxxS4Z/AlVM7ikTAvzGFpJITd8a','1234567890','tinhale1','ACTIVE');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance`
--

DROP TABLE IF EXISTS `insurance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance` (
  `coverage_money` decimal(38,2) DEFAULT NULL,
  `fee` decimal(38,2) DEFAULT NULL,
  `insured` int DEFAULT NULL,
  `release_at` date DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `terms` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance`
--

LOCK TABLES `insurance` WRITE;
/*!40000 ALTER TABLE `insurance` DISABLE KEYS */;
INSERT INTO `insurance` VALUES (10000000.00,500000.00,1,'2025-07-03','2025-07-23 10:52:29.901901',1,'2025-07-23 10:52:29.901901','Gói bảo hiểm cơ bản','Bảo hiểm Bảo Minh','Bảo hiểm áp dụng khi bị cháy nổ, va đập mạnh.','ACTIVE');
/*!40000 ALTER TABLE `insurance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance_contract`
--

DROP TABLE IF EXISTS `insurance_contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance_contract` (
  `coverage_money` decimal(38,2) DEFAULT NULL,
  `create_at` date DEFAULT NULL,
  `expired_date` date DEFAULT NULL,
  `fee` decimal(38,2) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `insurance_id` bigint DEFAULT NULL,
  `order_product_serial_id` bigint DEFAULT NULL,
  `contract_status` enum('ACTIVE','CANCELLED','EXPIRED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKlfcp9xahuqpangag827fwxiac` (`order_product_serial_id`),
  KEY `FK1iby30nqbmkvoho2d07ahgr5` (`insurance_id`),
  CONSTRAINT `FK1iby30nqbmkvoho2d07ahgr5` FOREIGN KEY (`insurance_id`) REFERENCES `insurance` (`id`),
  CONSTRAINT `FKdht8of5tgwga2l1aufnseltc2` FOREIGN KEY (`order_product_serial_id`) REFERENCES `order_product_serial` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance_contract`
--

LOCK TABLES `insurance_contract` WRITE;
/*!40000 ALTER TABLE `insurance_contract` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurance_contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance_pending`
--

DROP TABLE IF EXISTS `insurance_pending`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance_pending` (
  `quantity` int DEFAULT NULL,
  `status` enum('CANCELLED','CONFIRM','PENDING') DEFAULT NULL,
  `total_fee` decimal(38,2) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `insurance_id` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `order_product_id` bigint DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK48dgaj3h5sxyw6e2rm2e4ycrw` (`insurance_id`),
  KEY `FKfi6h85i329vd5o7os44dnllgo` (`order_id`),
  KEY `FKr2trtc6mev7sc884wps0ui84e` (`order_product_id`),
  CONSTRAINT `FK48dgaj3h5sxyw6e2rm2e4ycrw` FOREIGN KEY (`insurance_id`) REFERENCES `insurance` (`id`),
  CONSTRAINT `FKfi6h85i329vd5o7os44dnllgo` FOREIGN KEY (`order_id`) REFERENCES `order_table` (`id`),
  CONSTRAINT `FKr2trtc6mev7sc884wps0ui84e` FOREIGN KEY (`order_product_id`) REFERENCES `order_product` (`id`),
  CONSTRAINT `insurance_pending_chk_1` CHECK ((`status` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance_pending`
--

LOCK TABLES `insurance_pending` WRITE;
/*!40000 ALTER TABLE `insurance_pending` DISABLE KEYS */;
INSERT INTO `insurance_pending` VALUES (1,'',500000.00,1,1,1,1,'2025-07-23 10:56:28.232876'),(1,'',500000.00,2,1,2,1,'2025-07-23 11:00:54.703445'),(1,'',500000.00,3,1,3,1,'2025-07-23 11:04:37.123557');
/*!40000 ALTER TABLE `insurance_pending` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `map_product_store`
--

DROP TABLE IF EXISTS `map_product_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map_product_store` (
  `product_id` bigint NOT NULL,
  `store_id` bigint NOT NULL,
  PRIMARY KEY (`product_id`,`store_id`),
  KEY `FKmp3d1nacs7lcytr0o2cwts2xs` (`store_id`),
  CONSTRAINT `FKmp3d1nacs7lcytr0o2cwts2xs` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`),
  CONSTRAINT `FKmx0luekilk1d3fmemfp4dt464` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `map_product_store`
--

LOCK TABLES `map_product_store` WRITE;
/*!40000 ALTER TABLE `map_product_store` DISABLE KEYS */;
/*!40000 ALTER TABLE `map_product_store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_product` (
  `is_reviewed` bit(1) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_option` bigint NOT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp9qp59hyy3jry2n6c0ikfmq7b` (`order_id`),
  KEY `FK191sfq7n3p5xs3wq9bramveq1` (`product_option`),
  CONSTRAINT `FK191sfq7n3p5xs3wq9bramveq1` FOREIGN KEY (`product_option`) REFERENCES `product_option` (`id`),
  CONSTRAINT `FKp9qp59hyy3jry2n6c0ikfmq7b` FOREIGN KEY (`order_id`) REFERENCES `order_table` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product`
--

LOCK TABLES `order_product` WRITE;
/*!40000 ALTER TABLE `order_product` DISABLE KEYS */;
INSERT INTO `order_product` VALUES (_binary '\0',12990000.00,1,1,1,1,'2025-07-23 10:56:28.066766'),(_binary '\0',12990000.00,1,2,2,1,'2025-07-23 11:00:54.465108'),(_binary '\0',12990000.00,1,3,3,1,'2025-07-23 11:04:36.778423');
/*!40000 ALTER TABLE `order_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_product_serial`
--

DROP TABLE IF EXISTS `order_product_serial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_product_serial` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_product_id` bigint DEFAULT NULL,
  `serial_id` bigint DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKco22f470t9pwjkwf0nyp28d3o` (`order_product_id`),
  KEY `FK2hi8gme7frrpdag2t25xb3xtc` (`serial_id`),
  CONSTRAINT `FK2hi8gme7frrpdag2t25xb3xtc` FOREIGN KEY (`serial_id`) REFERENCES `product_serial` (`id`),
  CONSTRAINT `FKco22f470t9pwjkwf0nyp28d3o` FOREIGN KEY (`order_product_id`) REFERENCES `order_product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_product_serial`
--

LOCK TABLES `order_product_serial` WRITE;
/*!40000 ALTER TABLE `order_product_serial` DISABLE KEYS */;
INSERT INTO `order_product_serial` VALUES (1,2,1,'2025-07-23 11:01:33.050886'),(3,3,2,'2025-07-23 11:05:08.940345');
/*!40000 ALTER TABLE `order_product_serial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_promotion`
--

DROP TABLE IF EXISTS `order_promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_promotion` (
  `total_discount` decimal(38,2) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `promotion_id` bigint DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKirvwetx5mi8tuuwg80koes0y3` (`order_id`),
  KEY `FKm1hox1n285ljyyilfki1p13fa` (`promotion_id`),
  CONSTRAINT `FKirvwetx5mi8tuuwg80koes0y3` FOREIGN KEY (`order_id`) REFERENCES `order_table` (`id`),
  CONSTRAINT `FKm1hox1n285ljyyilfki1p13fa` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_promotion`
--

LOCK TABLES `order_promotion` WRITE;
/*!40000 ALTER TABLE `order_promotion` DISABLE KEYS */;
INSERT INTO `order_promotion` VALUES (1948500.00,1,1,1,'2025-07-23 10:56:28.156030'),(1948500.00,2,2,1,'2025-07-23 11:00:54.560024'),(1948500.00,3,3,1,'2025-07-23 11:04:36.936804');
/*!40000 ALTER TABLE `order_promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_table`
--

DROP TABLE IF EXISTS `order_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_table` (
  `total_money` decimal(38,2) DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `order_status` enum('CANCELLED','CONFIRM','PENDING') NOT NULL,
  `transport_method` enum('EXPRESS','FAST','PICKUP','STANDARD') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs21u5k81bgf1p5pxb3lch8of` (`user_id`),
  CONSTRAINT `FKs21u5k81bgf1p5pxb3lch8of` FOREIGN KEY (`user_id`) REFERENCES `customer` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_table`
--

LOCK TABLES `order_table` WRITE;
/*!40000 ALTER TABLE `order_table` DISABLE KEYS */;
INSERT INTO `order_table` VALUES (11041500.00,'2025-07-23 10:56:28.023583',1,'2025-07-23 10:56:28.023583',1,'Giao nhanh giúp mình','123 Nguyễn Huệ, Quận 1, TP.HCM','DELIVERY','PENDING','FAST'),(11041500.00,'2025-07-23 11:00:54.419596',2,'2025-07-23 11:01:33.198865',1,'Giao nhanh giúp mình','123 Nguyễn Huệ, Quận 1, TP.HCM','DELIVERY','CONFIRM','FAST'),(11041500.00,'2025-07-23 11:04:36.622358',3,'2025-07-23 11:05:09.210369',1,'Giao nhanh giúp mình','123 Nguyễn Huệ, Quận 1, TP.HCM','DELIVERY','CONFIRM','FAST');
/*!40000 ALTER TABLE `order_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `battery_capacity` decimal(38,2) DEFAULT NULL,
  `cpu_speed` decimal(38,2) DEFAULT NULL,
  `flash` bit(1) DEFAULT NULL,
  `release_year` int DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `warranty_id` bigint DEFAULT NULL,
  `advanced_util` varchar(255) DEFAULT NULL,
  `another_port` varchar(255) DEFAULT NULL,
  `back_camera` varchar(255) DEFAULT NULL,
  `back_camera_record` varchar(255) DEFAULT NULL,
  `back_camera_tech` varchar(255) DEFAULT NULL,
  `battery_tech` varchar(255) DEFAULT NULL,
  `battery_type` varchar(255) DEFAULT NULL,
  `bluetooth` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `charge_port` varchar(255) DEFAULT NULL,
  `charge_support` varchar(255) DEFAULT NULL,
  `cpu` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `design` varchar(255) DEFAULT NULL,
  `dimension` varchar(255) DEFAULT NULL,
  `earphone_port` varchar(255) DEFAULT NULL,
  `front_camera` varchar(255) DEFAULT NULL,
  `gps` varchar(255) DEFAULT NULL,
  `gpu` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `max_brightness` varchar(255) DEFAULT NULL,
  `mobile_network` varchar(255) DEFAULT NULL,
  `movie_util` varchar(255) DEFAULT NULL,
  `music_util` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `os` varchar(255) DEFAULT NULL,
  `record_util` varchar(255) DEFAULT NULL,
  `resistance_util` varchar(255) DEFAULT NULL,
  `screen_dimension` varchar(255) DEFAULT NULL,
  `screen_resolution` varchar(255) DEFAULT NULL,
  `screen_tech` varchar(255) DEFAULT NULL,
  `screen_touch` varchar(255) DEFAULT NULL,
  `sim` varchar(255) DEFAULT NULL,
  `special_util` varchar(255) DEFAULT NULL,
  `wifi` varchar(255) DEFAULT NULL,
  `product_status` enum('DRAFT','ONSELL','OUT_STOCK','PREORDER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKjmivyxk9rmgysrmsqw15lqr5b` (`name`),
  KEY `FK5cypb0k23bovo3rn1a5jqs6j4` (`category_id`),
  KEY `FKlv0b6qy9dkdoilur6uge15six` (`warranty_id`),
  CONSTRAINT `FK5cypb0k23bovo3rn1a5jqs6j4` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`),
  CONSTRAINT `FKlv0b6qy9dkdoilur6uge15six` FOREIGN KEY (`warranty_id`) REFERENCES `warranty_policy` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (5000.00,2.40,_binary '',2025,1,'2025-07-23 10:52:51.939427',1,'2025-07-23 10:52:51.939427',1,'AI Camera','None','50MP + 5MP + 2MP','4K@30fps','OIS','Fast Charging','Li-Po','5.3','Samsung','USB-C','25W','Exynos 1280','Smartphone with AMOLED display','Glass front, plastic back','162.1 x 76.5 x 8.3 mm','3.5mm','13MP','Yes','Mali-G68','Plastic','800 nits','5G','MP4, MKV','MP3, WAV','example','Android 13','Yes','IP67','6.5 inch','1080 x 2400','Super AMOLED','Multi-touch','Dual SIM','Samsung Knox','802.11 a/b/g/n/ac','DRAFT');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9qvug0bmpkmxkkx33q51m7do7` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES ('2025-07-23 10:51:39.643286',1,'2025-07-23 10:51:39.643286','OldPhone');
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_image`
--

DROP TABLE IF EXISTS `product_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_image` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `download_url` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `image` longblob,
  PRIMARY KEY (`id`),
  KEY `FK6oo0cvcdtb6qmwsga468uuukk` (`product_id`),
  CONSTRAINT `FK6oo0cvcdtb6qmwsga468uuukk` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_image`
--

LOCK TABLES `product_image` WRITE;
/*!40000 ALTER TABLE `product_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_option`
--

DROP TABLE IF EXISTS `product_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_option` (
  `color_name` tinyint DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `ram` int DEFAULT NULL,
  `remaining_quantity` int DEFAULT NULL,
  `reversed_quantity` int DEFAULT NULL,
  `rom` int DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKn4hmm6ex1vgn60c6uiqte400f` (`product_id`),
  CONSTRAINT `FKn4hmm6ex1vgn60c6uiqte400f` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_option_chk_1` CHECK ((`color_name` between 0 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_option`
--

LOCK TABLES `product_option` WRITE;
/*!40000 ALTER TABLE `product_option` DISABLE KEYS */;
INSERT INTO `product_option` VALUES (2,12990000.00,8,10,1,128,1,1);
/*!40000 ALTER TABLE `product_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_review`
--

DROP TABLE IF EXISTS `product_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_review` (
  `rating` int DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_product_id` bigint DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKc58g73olfr4o2gn6y95wkjjph` (`order_product_id`),
  KEY `FKbj8uaikcb3um4505bx84uvbm9` (`user_id`),
  CONSTRAINT `FKbj8uaikcb3um4505bx84uvbm9` FOREIGN KEY (`user_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `FKi2sx9wicibxthg3jchpqhch85` FOREIGN KEY (`order_product_id`) REFERENCES `order_product` (`id`),
  CONSTRAINT `product_review_chk_1` CHECK ((`status` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_review`
--

LOCK TABLES `product_review` WRITE;
/*!40000 ALTER TABLE `product_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_review_reply`
--

DROP TABLE IF EXISTS `product_review_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_review_reply` (
  `status` tinyint DEFAULT NULL,
  `admin_id` bigint DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `review_id` bigint DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `reply` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKo7i7ml76xgn8g0v6l7328ibih` (`review_id`),
  KEY `FKi2dnopswlbvn1h8ikqnafqoys` (`admin_id`),
  CONSTRAINT `FKe86oal0hnvy98g2ydgh7pg0to` FOREIGN KEY (`review_id`) REFERENCES `product_review` (`id`),
  CONSTRAINT `FKi2dnopswlbvn1h8ikqnafqoys` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`),
  CONSTRAINT `product_review_reply_chk_1` CHECK ((`status` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_review_reply`
--

LOCK TABLES `product_review_reply` WRITE;
/*!40000 ALTER TABLE `product_review_reply` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_review_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_serial`
--

DROP TABLE IF EXISTS `product_serial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_serial` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_option_id` bigint DEFAULT NULL,
  `store_id` bigint DEFAULT NULL,
  `serial_number` varchar(255) NOT NULL,
  `status` enum('AVAILABLE','BROKEN','RETURN','REVERSED','SOLD') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcqf1hv2tcg0vi6w7qmfvwuf8w` (`product_option_id`),
  KEY `FKdqvqmxd6f76taldnbleaxckgy` (`store_id`),
  CONSTRAINT `FKcqf1hv2tcg0vi6w7qmfvwuf8w` FOREIGN KEY (`product_option_id`) REFERENCES `product_option` (`id`),
  CONSTRAINT `FKdqvqmxd6f76taldnbleaxckgy` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_serial`
--

LOCK TABLES `product_serial` WRITE;
/*!40000 ALTER TABLE `product_serial` DISABLE KEYS */;
INSERT INTO `product_serial` VALUES (1,1,1,'101','SOLD'),(2,1,1,'999','SOLD'),(3,1,1,'888','AVAILABLE'),(4,1,1,'777','AVAILABLE'),(5,1,1,'666','AVAILABLE'),(6,1,1,'555','AVAILABLE'),(7,1,1,'444','AVAILABLE'),(8,1,1,'333','AVAILABLE'),(9,1,1,'222','AVAILABLE'),(10,1,1,'111','AVAILABLE');
/*!40000 ALTER TABLE `product_serial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `discount_value` decimal(38,2) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `remaining_quantity` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `discount_type` enum('AMOUNT','PERCENTAGE') DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (15.00,'2025-07-31',100,97,'2025-07-01',1,'KM15','Giảm giá cho đơn hàng tháng 7','Khuyến mãi 15%','PERCENTAGE','ACTIVE');
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES (1,'2025-07-23 10:51:56.578938','2st Nguyen Hue','second store');
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport`
--

DROP TABLE IF EXISTS `transport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport` (
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `update_at` datetime(6) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `shipping_method` enum('EXPRESS','FAST','PICKUP','STANDARD') DEFAULT NULL,
  `shipping_status` enum('CANCELLED','DELIVERED','INTRANSIT','PROCESSING','REFUND') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpjyf16mdunodp9bawrjvcrce3` (`order_id`),
  CONSTRAINT `FKlevg8rua5ld3oph9teh1opddn` FOREIGN KEY (`order_id`) REFERENCES `order_table` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport`
--

LOCK TABLES `transport` WRITE;
/*!40000 ALTER TABLE `transport` DISABLE KEYS */;
INSERT INTO `transport` VALUES ('2025-07-23 11:01:33.198865',1,2,'2025-07-23 11:01:33.198865','123 Nguyễn Huệ, Quận 1, TP.HCM','TRK2307202500000TF','FAST','PROCESSING'),('2025-07-23 11:05:09.210369',3,3,'2025-07-23 11:05:09.210369','123 Nguyễn Huệ, Quận 1, TP.HCM','TRK2307202500002TF','FAST','PROCESSING');
/*!40000 ALTER TABLE `transport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warranty_card`
--

DROP TABLE IF EXISTS `warranty_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warranty_card` (
  `end_date` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `product_serial_id` bigint DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `status` enum('ACTIVE','EXPIRED','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6hfc5makvm0br97yhyr02vqm4` (`product_serial_id`),
  KEY `FK95niy6ituarelf9va8qrlt6rg` (`order_id`),
  CONSTRAINT `FK95niy6ituarelf9va8qrlt6rg` FOREIGN KEY (`order_id`) REFERENCES `order_table` (`id`),
  CONSTRAINT `FKm7he1i7dqyu644slm3f3mywvi` FOREIGN KEY (`product_serial_id`) REFERENCES `product_serial` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warranty_card`
--

LOCK TABLES `warranty_card` WRITE;
/*!40000 ALTER TABLE `warranty_card` DISABLE KEYS */;
INSERT INTO `warranty_card` VALUES ('2026-07-23 11:01:33.098440',1,2,1,'2025-07-23 11:01:33.098440','ACTIVE'),('2026-07-23 11:05:09.109120',3,3,2,'2025-07-23 11:05:09.109120','ACTIVE');
/*!40000 ALTER TABLE `warranty_card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warranty_policy`
--

DROP TABLE IF EXISTS `warranty_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warranty_policy` (
  `duration` int DEFAULT NULL,
  `create_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `update_at` datetime(6) DEFAULT NULL,
  `conditon` varchar(255) DEFAULT NULL,
  `exception_case` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warranty_policy`
--

LOCK TABLES `warranty_policy` WRITE;
/*!40000 ALTER TABLE `warranty_policy` DISABLE KEYS */;
INSERT INTO `warranty_policy` VALUES (12,'2025-07-23 10:51:48.791019',1,'2025-07-23 10:51:48.791019','Áp dụng khi có lỗi kỹ thuật từ nhà sản xuất','Không áp dụng khi rơi vỡ, vào nước','Bảo hành 12 tháng','Chỉ bảo hành 1 lần trong thời hạn');
/*!40000 ALTER TABLE `warranty_policy` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-23 11:17:13
