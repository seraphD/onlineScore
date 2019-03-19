/*
 Navicat MySQL Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50714
 Source Host           : localhost:3306
 Source Schema         : online_scoe

 Target Server Type    : MySQL
 Target Server Version : 50714
 File Encoding         : 65001

 Date: 19/03/2019 15:35:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student`  (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `group_id` int(255) NOT NULL,
  PRIMARY KEY (`name`) USING BTREE
) ENGINE = MyISAM CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES ('马海强', 1);
INSERT INTO `student` VALUES ('徐鑫雨', 1);
INSERT INTO `student` VALUES ('张　凡 ', 1);
INSERT INTO `student` VALUES ('郑柳', 2);
INSERT INTO `student` VALUES ('陈铭璇', 2);
INSERT INTO `student` VALUES ('王胤凯 ', 2);
INSERT INTO `student` VALUES ('张鑫', 3);
INSERT INTO `student` VALUES ('祝夏云 ', 3);
INSERT INTO `student` VALUES ('杨德杰', 4);
INSERT INTO `student` VALUES ('干臻原', 4);
INSERT INTO `student` VALUES ('李伊宁 ', 4);
INSERT INTO `student` VALUES ('万峰', 6);
INSERT INTO `student` VALUES ('朱勋韬', 6);
INSERT INTO `student` VALUES ('谢强 ', 6);
INSERT INTO `student` VALUES ('王绎朝', 7);
INSERT INTO `student` VALUES ('梅思远 ', 7);
INSERT INTO `student` VALUES ('陈豪 ', 9);
INSERT INTO `student` VALUES ('李帆顺', 14);
INSERT INTO `student` VALUES ('周渊博 ', 14);
INSERT INTO `student` VALUES ('任亚伟', 5);
INSERT INTO `student` VALUES ('彭艳 ', 5);
INSERT INTO `student` VALUES ('罗淳', 8);
INSERT INTO `student` VALUES ('付朝燕 ', 8);
INSERT INTO `student` VALUES ('叶艳洁', 10);
INSERT INTO `student` VALUES ('蔡雅洁', 10);
INSERT INTO `student` VALUES ('章薇', 10);
INSERT INTO `student` VALUES ('陶娣 ', 10);
INSERT INTO `student` VALUES ('周威炜', 11);
INSERT INTO `student` VALUES ('顾晨俊', 11);
INSERT INTO `student` VALUES ('钱根', 11);
INSERT INTO `student` VALUES ('张承成 ', 11);
INSERT INTO `student` VALUES ('陈其快', 12);
INSERT INTO `student` VALUES ('吴震', 12);
INSERT INTO `student` VALUES ('王鑫', 12);
INSERT INTO `student` VALUES ('程广友 ', 12);
INSERT INTO `student` VALUES ('吴佳琪', 13);
INSERT INTO `student` VALUES ('陈贵婷', 13);
INSERT INTO `student` VALUES ('王秸 ', 13);
INSERT INTO `student` VALUES ('陈俊卿', 15);
INSERT INTO `student` VALUES ('齐聪聪 ', 15);
INSERT INTO `student` VALUES ('李博乐', 16);
INSERT INTO `student` VALUES ('孔昊东 ', 16);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(255) NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `github` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `number` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `grade` int(255) NOT NULL,
  `login` int(10) NULL DEFAULT NULL,
  PRIMARY KEY (`number`, `id`) USING BTREE
) ENGINE = MyISAM CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '二手物品交易网站', 'https://github.com/WebProject111/web', '15058613833', 82, 0);
INSERT INTO `user` VALUES (2, '书籍收藏推荐', 'https://github.com/xiaxixi/Book-recommendation-collection', '15990184770', 92, 0);
INSERT INTO `user` VALUES (3, '形体管理', 'https://github.com/zhangxin1102/zhangxin.github.com', '18969949128', 90, 0);
INSERT INTO `user` VALUES (4, '代码技术问题社区', '', '15990184787', 90, 0);
INSERT INTO `user` VALUES (6, '聊天室', 'https://github.com/XQ0118/project-desktop.git', '17376507894', 90, 0);
INSERT INTO `user` VALUES (7, 'Duel - 手势游戏', 'https://github.com/Darkmota/Duel', '15990184717', 83, 0);
INSERT INTO `user` VALUES (9, ' 微信小程序', 'https://github.com/15305813298/-', '15305813298', 88, 0);
INSERT INTO `user` VALUES (14, ' mk编辑器', 'https://github.com/oddisland/Draft', '15990184849', 96, 0);
INSERT INTO `user` VALUES (5, 'Resume Making', 'https://github.com/natsuRen/web', '15355468038', 0, 0);
INSERT INTO `user` VALUES (8, '亦书亦音', 'https://github.com/slcyyy/ysyy', '15990184855', 0, 0);
INSERT INTO `user` VALUES (10, ' 微信小程序-零拾实验室', 'https://github.com/PTaoer/WebProgramming', '15990184827', 0, 0);
INSERT INTO `user` VALUES (11, '论坛', '', '18989845722', 0, 0);
INSERT INTO `user` VALUES (12, '音乐播放器', 'https://github.com/klaaay/My-Silly-Music-Player', '15990184811', 0, 0);
INSERT INTO `user` VALUES (13, '照片编辑器', 'https://github.com/Fionakiki/Myproject', '15355467622', 0, 0);
INSERT INTO `user` VALUES (15, ' 淘宝', 'https://github.com/xylkh/web_project  ', '18989849378', 0, 0);
INSERT INTO `user` VALUES (16, '影视推荐', 'https://github.com/eliotkong/web_movie_hznu', '15990184818', 0, 0);

SET FOREIGN_KEY_CHECKS = 1;
