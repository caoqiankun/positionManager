/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : situation

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-09-26 13:58:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for antenna
-- ----------------------------
--SET FOREIGN_KEY_CHECKS=0;
--SET NAMES UTF8;
--DROP DATABASE IF EXISTS situation;
--CREATE DATABASE situation CHARSET=UTF8;
--USE situation;
DROP TABLE IF EXISTS `antenna`;
CREATE TABLE `antenna` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `antNum` varchar(25) DEFAULT NULL,
  `point` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of antenna
-- ----------------------------
INSERT INTO `antenna` VALUES ('6', '4956', '6,1,3');
INSERT INTO `antenna` VALUES ('7', '4954', '3,1,2');
INSERT INTO `antenna` VALUES ('8', '5015', '0,1,1');
INSERT INTO `antenna` VALUES ('9', '5014', '2,3,1');

-- ----------------------------
-- Table structure for cardinfo
-- ----------------------------
DROP TABLE IF EXISTS `cardinfo`;
CREATE TABLE `cardinfo` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `cardid` varchar(40) DEFAULT NULL,
  `insertTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cardinfo
-- ----------------------------
INSERT INTO `cardinfo` VALUES ('28', '318841', '2017-09-21 15:25:25');
INSERT INTO `cardinfo` VALUES ('39', '318839', '2017-09-21 15:40:42');
INSERT INTO `cardinfo` VALUES ('40', '326842', '2017-09-21 15:58:28');
INSERT INTO `cardinfo` VALUES ('41', '326844', '2017-09-21 15:58:36');
INSERT INTO `cardinfo` VALUES ('42', '326847', '2017-09-21 15:58:45');

-- ----------------------------
-- Table structure for hisdata
-- ----------------------------
DROP TABLE IF EXISTS `hisdata`;
CREATE TABLE `hisdata` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `tagid` varchar(30) DEFAULT NULL,
  `distance` double(30,0) DEFAULT NULL,
  `insertTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1399 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of hisdata
-- ----------------------------
INSERT INTO `hisdata` VALUES ('1', '123d', '123', '2017-09-21 11:01:29');
INSERT INTO `hisdata` VALUES ('2', '123d', '123', '2017-09-21 11:01:44');
INSERT INTO `hisdata` VALUES ('3', '1234a', '123', '2017-09-21 11:01:44');
INSERT INTO `hisdata` VALUES ('4', '123d', '123', '2017-09-21 11:01:47');
INSERT INTO `hisdata` VALUES ('5', '1234a', '1245', '2017-09-21 11:01:47');
INSERT INTO `hisdata` VALUES ('6', '123d', '356', '2017-09-21 11:01:50');
INSERT INTO `hisdata` VALUES ('7', '1234a', '123', '2017-09-21 11:01:50');
INSERT INTO `hisdata` VALUES ('8', '123d', '123', '2017-09-21 11:01:55');
INSERT INTO `hisdata` VALUES ('9', '1234a', '0', '2017-09-21 11:01:55');
INSERT INTO `hisdata` VALUES ('10', '123d', '0', '2017-09-21 11:01:58');
INSERT INTO `hisdata` VALUES ('11', '1234a', '0', '2017-09-21 11:01:58');
INSERT INTO `hisdata` VALUES ('12', '123d', '0', '2017-09-21 11:02:01');
INSERT INTO `hisdata` VALUES ('13', '1234a', '0', '2017-09-21 11:02:01');
INSERT INTO `hisdata` VALUES ('14', '123d', '0', '2017-09-21 11:02:04');
INSERT INTO `hisdata` VALUES ('15', '1234a', '0', '2017-09-21 11:02:04');
INSERT INTO `hisdata` VALUES ('16', '123d', '0', '2017-09-21 11:02:07');
INSERT INTO `hisdata` VALUES ('17', '1234a', '0', '2017-09-21 11:02:07');
INSERT INTO `hisdata` VALUES ('18', '123d', '0', '2017-09-21 11:02:10');
INSERT INTO `hisdata` VALUES ('19', '1234a', '0', '2017-09-21 11:02:10');
INSERT INTO `hisdata` VALUES ('20', '123d', '0', '2017-09-21 11:02:13');
INSERT INTO `hisdata` VALUES ('21', '1234a', '0', '2017-09-21 11:02:13');
INSERT INTO `hisdata` VALUES ('22', '123d', '0', '2017-09-21 11:02:16');
INSERT INTO `hisdata` VALUES ('23', '1234a', '0', '2017-09-21 11:02:16');
-- ----------------------------
-- Table structure for login
-- ----------------------------
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `id` int(15) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of login
-- ----------------------------
INSERT INTO `login` VALUES ('1', 'admin', '123456');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uname` varchar(15) DEFAULT NULL,
  `tagid` int(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `标签` (`tagid`) USING BTREE,
  CONSTRAINT `标签id` FOREIGN KEY (`tagid`) REFERENCES `cardinfo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('59', '牛', '28');
INSERT INTO `user` VALUES ('60', '羊', '39');
INSERT INTO `user` VALUES ('68', '牛', '40');
INSERT INTO `user` VALUES ('69', 'ma', '41');
