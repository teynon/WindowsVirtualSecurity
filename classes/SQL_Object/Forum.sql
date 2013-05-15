CREATE TABLE IF NOT EXISTS `forum_cats` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `PID` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

INSERT INTO `forum_cats` (`ID`, `name`, `PID`) VALUES
(1, 'Main Category 1', 0),
(2, 'Sub Category 1', 1),
(3, 'Sub Sub Category 1', 2),
(4, 'Main Category 2', 0);