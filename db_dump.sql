-- MySQL dump 10.13  Distrib 5.7.20, for Win64 (x86_64)
--
-- Host: localhost    Database: carpenter
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `lot_statuses`
--

DROP TABLE IF EXISTS `lot_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lot_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE latin1_general_cs NOT NULL,
  `code` varchar(50) COLLATE latin1_general_cs NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lot_version_measures`
--

DROP TABLE IF EXISTS `lot_version_measures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lot_version_measures` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `thickness` double DEFAULT NULL,
  `length` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  `id_lot_version` int(11) DEFAULT NULL,
  `d_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lot_version_id_fk_idx` (`id_lot_version`),
  CONSTRAINT `lot_version_id_fk` FOREIGN KEY (`id_lot_version`) REFERENCES `lot_versions` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8811 DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lot_versions`
--

DROP TABLE IF EXISTS `lot_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lot_versions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_lot` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lot_fk_idx` (`id_lot`),
  CONSTRAINT `lot_fk` FOREIGN KEY (`id_lot`) REFERENCES `lots` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lots`
--

DROP TABLE IF EXISTS `lots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) COLLATE latin1_general_cs DEFAULT NULL,
  `type` varchar(50) COLLATE latin1_general_cs DEFAULT NULL,
  `class` varchar(50) COLLATE latin1_general_cs DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `aging` varchar(50) COLLATE latin1_general_cs DEFAULT NULL,
  `processing` varchar(50) COLLATE latin1_general_cs DEFAULT NULL,
  `customer` varchar(70) COLLATE latin1_general_cs DEFAULT NULL,
  `length` int(11) DEFAULT NULL,
  `thickness` int(11) DEFAULT NULL,
  `volume` int(11) DEFAULT NULL,
  `total` double NOT NULL DEFAULT '0',
  `pieces` int(11) NOT NULL DEFAULT '0',
  `i_date` datetime DEFAULT NULL,
  `u_date` datetime DEFAULT NULL,
  `d_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status_idx` (`status`),
  CONSTRAINT `status` FOREIGN KEY (`status`) REFERENCES `lot_statuses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE latin1_general_cs DEFAULT NULL,
  `surname` varchar(50) COLLATE latin1_general_cs DEFAULT NULL,
  `username` varchar(50) COLLATE latin1_general_cs DEFAULT NULL,
  `password` varchar(60) COLLATE latin1_general_cs DEFAULT NULL,
  `i_date` datetime DEFAULT NULL,
  `u_date` datetime DEFAULT NULL,
  `d_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'carpenter'
--
/*!50003 DROP PROCEDURE IF EXISTS `create_new_version` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_new_version`(in lotId int, in percentageThickness double, in percentageLength double, in percentageWidth double)
BEGIN

	DECLARE maxVersionNumber int;
    
    DECLARE maxLotVersionId int;
    
    DECLARE newLotVersionId int;
    
    DECLARE thicknessFetched double;
    DECLARE lengthFetched double;
    DECLARE widthFetched double;
    DECLARE d_dateFetched datetime;
    DECLARE lotVersionIdFetched int;
    
    DECLARE done INT DEFAULT FALSE;
    
	DECLARE cur CURSOR FOR
		select thickness, length, width, d_date, newLotVersionId
		from lot_version_measures
		where id_lot_version = maxLotVersionId;
    
	DECLARE exit handler for sqlexception
	  BEGIN
		-- ERROR
	  ROLLBACK;
      RESIGNAL;
	END;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

	START TRANSACTION;
    
    IF percentageThickness = 0 THEN
		SET percentageThickness = 1;
	END IF;
    
    IF percentageLength = 0 THEN
		SET percentageLength = 1;
	END IF;
    
    IF percentageWidth = 0 THEN
		SET percentageWidth = 1;
	END IF;
   
	select max(`number`), id into maxVersionNumber, maxLotVersionId
    from lot_versions
    where id_lot = lotId and
		`number` = (select max(`number`)
		from lot_versions
		where id_lot = lotId);
    
    insert into lot_versions (id_lot, `number`)
    values (lotId, maxVersionNumber + 1);
    
    select last_insert_id() into newLotVersionId;
    
    OPEN cur;
    measures_loop: REPEAT 
    
		FETCH cur INTO thicknessFetched, lengthFetched, widthFetched, d_dateFetched, lotVersionIdFetched;
        
        IF done THEN
			CLOSE cur;
			LEAVE measures_loop;
		END IF;
    
		IF d_dateFetched IS NULL THEN
        
			insert into lot_version_measures (thickness, length, width, d_date, id_lot_version)
            values (thicknessFetched * percentageThickness, lengthFetched * percentageLength, widthFetched * percentageWidth, d_dateFetched, newLotVersionId);
            
		ELSE
        
			insert into lot_version_measures (thickness, length, width, d_date, id_lot_version)
            values (thicknessFetched, lengthFetched, widthFetched, d_dateFetched, newLotVersionId);
        
        END IF;
        
    UNTIL done END REPEAT;

	COMMIT;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-02-20 23:55:26
