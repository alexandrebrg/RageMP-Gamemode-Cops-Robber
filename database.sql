-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           10.1.30-MariaDB - mariadb.org binary distribution
-- SE du serveur:                Win32
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Export de la structure de la base pour gta5
CREATE DATABASE IF NOT EXISTS `gta5` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `gta5`;

-- Export de la structure de la table gta5. logs
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(1024) NOT NULL,
  `type` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=610 DEFAULT CHARSET=latin1;

/*!40000 ALTER TABLE `logs` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_access
CREATE TABLE IF NOT EXISTS `server_access` (
  `player_id` int(11) NOT NULL,
  `faction_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_access : ~0 rows (environ)
/*!40000 ALTER TABLE `server_access` DISABLE KEYS */;
/*!40000 ALTER TABLE `server_access` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_admins
CREATE TABLE IF NOT EXISTS `server_admins` (
  `id` int(11) NOT NULL,
  `default` int(11) NOT NULL,
  `name` varchar(24) NOT NULL,
  `upgraded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `see` int(3) NOT NULL,
  `blame` int(3) NOT NULL,
  `edit` int(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_admins : ~1 rows (environ)
/*!40000 ALTER TABLE `server_admins` DISABLE KEYS */;
INSERT INTO `server_admins` (`id`, `default`, `name`, `upgraded`, `see`, `blame`, `edit`) VALUES
	(1, 0, 'Alexandre_Lasque', '2018-06-15 17:32:04', 0, 0, 9);
/*!40000 ALTER TABLE `server_admins` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_biz
CREATE TABLE IF NOT EXISTS `server_biz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `posx` float NOT NULL,
  `posy` float NOT NULL,
  `posz` float NOT NULL,
  `dimension` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_biz : ~9 rows (environ)
/*!40000 ALTER TABLE `server_biz` DISABLE KEYS */;
INSERT INTO `server_biz` (`id`, `type`, `name`, `posx`, `posy`, `posz`, `dimension`) VALUES
	(1, 2, '~r~Ammunation', 252.651, -48.0221, 69.9411, 0),
	(2, 1, '~b~24/7', 374.52, 327.459, 103.566, 0),
	(3, 1, '~b~24/7', 1163.1, -323.41, 69.2051, 0),
	(4, 1, '~b~24/7', -1487.59, -379.596, 40.1634, 0),
	(5, 1, '~b~24/7', -1223.64, -906.625, 12.3264, 0),
	(6, 1, '~b~24/7', -708.631, -914.254, 19.2156, 0),
	(7, 1, '~b~24/7', 26.3306, -1346.84, 29.497, 0),
	(8, 1, '~b~24/7', -49.0595, -1757.06, 29.421, 0),
	(9, 2, '~r~Ammunation', 20.2415, -1107.18, 29.797, 0),
	(10, 2, '~r~Ammunation', 844.076, -1033, 28.1949, 0),
	(11, 2, '~r~Ammunation', -1306.08, -392.258, 36.6958, 0);
/*!40000 ALTER TABLE `server_biz` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_factions
CREATE TABLE IF NOT EXISTS `server_factions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(24) NOT NULL,
  `restricted` int(11) NOT NULL DEFAULT '0',
  `leader` varchar(128) NOT NULL DEFAULT 'NoOne',
  `desc` varchar(128) NOT NULL DEFAULT 'A new gang ins in town baby',
  `cop` int(11) NOT NULL DEFAULT '0',
  `default_car` varchar(50) NOT NULL DEFAULT 'exemplar',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_factions : ~4 rows (environ)
/*!40000 ALTER TABLE `server_factions` DISABLE KEYS */;
INSERT INTO `server_factions` (`id`, `name`, `restricted`, `leader`, `desc`, `cop`, `default_car`) VALUES
	(1, 'Civil', 0, 'NoOne', 'Be a good or a bag boy', 0, 'exemplar'),
	(2, 'LSPD', 1, 'NoOne', 'be a cop', 1, 'police2'),
	(3, 'FIB', 1, 'NoOne', 'Better than cops, worse than SWAT', 1, 'fbi'),
	(4, 'SWAT', 1, 'NoOne', 'The elite of the game', 1, 'fbi2');
/*!40000 ALTER TABLE `server_factions` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_labels
CREATE TABLE IF NOT EXISTS `server_labels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(128) NOT NULL,
  `posx` float NOT NULL,
  `posy` float NOT NULL,
  `posz` float NOT NULL,
  `los` int(11) NOT NULL DEFAULT '0',
  `font` int(11) NOT NULL DEFAULT '0',
  `drawDistance` int(11) NOT NULL DEFAULT '50',
  `dimension` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_labels : ~1 rows (environ)
/*!40000 ALTER TABLE `server_labels` DISABLE KEYS */;
INSERT INTO `server_labels` (`id`, `text`, `posx`, `posy`, `posz`, `los`, `font`, `drawDistance`, `dimension`) VALUES
	(1, '~h~Los Santos Bank', 228.068, 213.383, 105.525, 0, 0, 50, 0);
/*!40000 ALTER TABLE `server_labels` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_peds
CREATE TABLE IF NOT EXISTS `server_peds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hash` int(11) NOT NULL,
  `name` varchar(24) NOT NULL,
  `faction_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_peds : ~8 rows (environ)
/*!40000 ALTER TABLE `server_peds` DISABLE KEYS */;
INSERT INTO `server_peds` (`id`, `hash`, `name`, `faction_id`) VALUES
	(1, -1709285806, 'Billy', 1),
	(2, 605602864, 'Amy', 1),
	(3, 846439045, 'SalvaGoon', 2),
	(4, 874722259, 'FIBArchitect', 3),
	(5, -1920001264, 'SWAT', 4),
	(6, 788443093, 'SWAT', 4),
	(7, 1558115333, 'FIB 2', 3),
	(8, 653289389, 'FIB 3', 3),
	(9, 2147483647, 'John', 1);
/*!40000 ALTER TABLE `server_peds` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_players
CREATE TABLE IF NOT EXISTS `server_players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(24) NOT NULL,
  `email` varchar(156) NOT NULL,
  `password` varchar(128) NOT NULL,
  `spenttime` int(11) NOT NULL DEFAULT '0',
  `cash` bigint(20) NOT NULL DEFAULT '0',
  `bank` bigint(20) NOT NULL DEFAULT '0',
  `wantedlevel` int(11) NOT NULL DEFAULT '0',
  `jail` int(11) NOT NULL DEFAULT '0',
  `hacker` int(11) NOT NULL DEFAULT '0',
  `reseller` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_players : ~1 rows (environ)
/*!40000 ALTER TABLE `server_players` DISABLE KEYS */;
INSERT INTO `server_players` (`id`, `name`, `email`, `password`, `spenttime`, `cash`, `bank`, `wantedlevel`, `jail`, `hacker`, `reseller`) VALUES
	(1, 'Protocole', 'test@test.fr', 'dc96950fcc187d281129ab23c2eb598f', 2679, 723979, 66155, 0, 0, 801, 5);
/*!40000 ALTER TABLE `server_players` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_spawnpoints
CREATE TABLE IF NOT EXISTS `server_spawnpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `posx` float NOT NULL,
  `posy` float NOT NULL,
  `posz` float NOT NULL,
  `angle` float NOT NULL,
  `faction_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_spawnpoints : ~8 rows (environ)
/*!40000 ALTER TABLE `server_spawnpoints` DISABLE KEYS */;
INSERT INTO `server_spawnpoints` (`id`, `posx`, `posy`, `posz`, `angle`, `faction_id`) VALUES
	(1, -0.030556, 0.19665, 71.1421, 0, 1),
	(2, -2.72093, 4.87587, 70.9667, 0, 1),
	(3, -4.74143, 7.34772, 71.0118, 0, 1),
	(4, -0.0257488, 0.175339, 71.1435, 0, 1),
	(5, -0.22514, 1.03554, 71.0866, 0, 1),
	(6, -4.67553, 1.88651, 71.148, 0, 1),
	(14, 431.489, -981.508, 30.7106, 84.0704, 2),
	(15, 102.045, -706.832, 33.1332, 238.013, 3),
	(16, 222.603, -975.603, -99, 189.42, 4);
/*!40000 ALTER TABLE `server_spawnpoints` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_teleporters
CREATE TABLE IF NOT EXISTS `server_teleporters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(24) NOT NULL,
  `from_x` float NOT NULL,
  `from_y` float NOT NULL,
  `from_z` float NOT NULL,
  `from_dimension` int(11) NOT NULL,
  `from_angle` float NOT NULL,
  `to_x` float NOT NULL,
  `to_y` float NOT NULL,
  `to_z` float NOT NULL,
  `to_dimension` int(11) DEFAULT NULL,
  `to_angle` float DEFAULT NULL,
  `veh` int(11) NOT NULL DEFAULT '0',
  `reverse` int(11) NOT NULL DEFAULT '1',
  `faction` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_teleporters : ~3 rows (environ)
/*!40000 ALTER TABLE `server_teleporters` DISABLE KEYS */;
INSERT INTO `server_teleporters` (`id`, `name`, `from_x`, `from_y`, `from_z`, `from_dimension`, `from_angle`, `to_x`, `to_y`, `to_z`, `to_dimension`, `to_angle`, `veh`, `reverse`, `faction`) VALUES
	(1, 'Take the Elevator', 237.316, -1004.89, -99, 0, 91.6873, 237.316, -1004.89, -99, 1, 91.6873, 0, 1, 1),
	(2, 'Go outside', 231.259, -1005.69, -99, 0, 225.352, 27, -657.6, 31.628, 0, 278.06, 1, 1, 4),
	(3, 'Go outside', 231.259, -1005.69, -99, 1, 225.352, 27, -657.6, 31.628, 0, 278.06, 1, 0, 4);
/*!40000 ALTER TABLE `server_teleporters` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_vehicles
CREATE TABLE IF NOT EXISTS `server_vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `faction_id` int(11) NOT NULL DEFAULT '1',
  `name` varchar(150) NOT NULL,
  `posx` float NOT NULL,
  `posy` float NOT NULL,
  `posz` float NOT NULL,
  `angle` float NOT NULL,
  `color1` int(11) NOT NULL DEFAULT '0',
  `color2` int(11) NOT NULL DEFAULT '0',
  `plate` varchar(8) NOT NULL DEFAULT 'None',
  `locked` int(11) NOT NULL DEFAULT '0',
  `dimension` int(11) NOT NULL DEFAULT '1001',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_vehicles : ~22 rows (environ)
/*!40000 ALTER TABLE `server_vehicles` DISABLE KEYS */;
INSERT INTO `server_vehicles` (`id`, `faction_id`, `name`, `posx`, `posy`, `posz`, `angle`, `color1`, `color2`, `plate`, `locked`, `dimension`) VALUES
	(1, 2, 'police3', 408.003, -979.996, 29.024, 50.1982, 111, 0, 'LSPD', 0, 0),
	(2, 1, 'xls2', 407.976, -985.923, 32.2658, 67.9134, 12, 12, 'Civil', 0, 0),
	(3, 1, 'exemplar', -5.61767, 13.173, 70.5827, 250.11, 42, 0, 'Civil', 0, 0),
	(4, 1, 'cog552', 14.93, 5.42913, 69.8172, 250.931, 0, 0, 'Civil', 0, 0),
	(5, 3, 'fbi', 97.9673, -709.134, 32.7795, 248.924, 42, 42, 'FIB', 0, 0),
	(6, 3, 'fbi', 107.912, -708.259, 36.1332, 224.811, 0, 0, 'FIB', 0, 0),
	(7, 3, 'fbi2', 110.01, -714.285, 32.7554, 160.792, 0, 0, 'FIB', 0, 0),
	(8, 4, 'riot', 224.666, -981.056, -99.3482, 246.73, 12, 0, 'SWAT', 0, 0),
	(9, 4, 'riot2', 225.226, -985.935, -99.1655, 243.499, 12, 0, 'SWAT', 0, 0),
	(10, 4, 'pranger', 224.609, -990.241, -99.3779, 243.012, 12, 0, 'SWAT', 0, 0),
	(11, 4, 'barrage', 223.787, -993.83, -99.2737, 240.062, 13, 0, 'SWAT', 0, 0),
	(12, 4, 'brawler', 223.547, -997.651, -99.1502, 243.157, 12, 0, 'SWAT', 0, 0),
	(13, 4, 'kuruma2', 223.078, -1000.79, -99.26, 246.801, 12, 0, 'SWAT', 0, 0),
	(14, 2, 'police2', 407.576, -993.097, 28.8789, 50.662, 0, 0, 'LSPD', 0, 0),
	(15, 4, 'insurgent', 223.456, -989.332, -99.0803, 252.668, 12, 0, 'SWAT', 0, 1),
	(16, 4, 'police', 223.741, -979.362, -99.3931, 255.281, 12, 0, 'SWAT', 0, 1),
	(17, 4, 'furoregt', 223.522, -982.68, -99.5829, 255.454, 12, 0, 'SWAT', 0, 1),
	(18, 4, 'contender', 223.434, -985.77, -98.772, 254.238, 12, 0, 'SWAT', 0, 1),
	(19, 4, 'blazer', 234.801, -982.507, -99.4964, 137.893, 12, 0, 'SWAT', 0, 1),
	(20, 4, 'diablous', 235.136, -984.348, -99.6552, 141.551, 12, 0, 'SWAT', 0, 1),
	(21, 4, 'buffalo', 223.503, -992.583, -99.3804, 254.057, 12, 0, 'SWAT', 0, 1),
	(22, 4, 'specter2', 223.655, -995.946, -99.7381, 252.579, 12, 0, 'SWAT', 0, 1),
	(23, 1, 'bati', -0.448481, 5.22447, 73.9543, 219.527, 12, 12, 'ADMIN', 0, 0),
	(24, 1, 'gauntlet', -12.6261, 15.7923, 70.8847, 249.043, 12, 42, 'ADMIN', 0, 0),
	(25, 1, 'dune4', -20.5005, 18.5908, 71.1588, 251.17, 12, 0, 'ADMIN', 0, 0);
/*!40000 ALTER TABLE `server_vehicles` ENABLE KEYS */;

-- Export de la structure de la table gta5. server_vehicles_mods
CREATE TABLE IF NOT EXISTS `server_vehicles_mods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `veh_id` int(11) NOT NULL,
  `modType` int(11) NOT NULL,
  `modIndex` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Export de données de la table gta5.server_vehicles_mods : ~16 rows (environ)
/*!40000 ALTER TABLE `server_vehicles_mods` DISABLE KEYS */;
INSERT INTO `server_vehicles_mods` (`id`, `veh_id`, `modType`, `modIndex`) VALUES
	(1, 3, 14, 7),
	(2, 3, 23, 3),
	(3, 24, 11, 3),
	(4, 24, 12, 2),
	(5, 24, 13, 2),
	(6, 24, 15, 2),
	(7, 24, 16, 4),
	(8, 24, 22, 1),
	(9, 24, 23, 7),
	(10, 25, 11, 3),
	(11, 25, 12, 2),
	(12, 25, 13, 2),
	(13, 25, 16, 4),
	(14, 25, 18, 1),
	(15, 25, 22, 1),
	(16, 25, 23, 5);
/*!40000 ALTER TABLE `server_vehicles_mods` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
