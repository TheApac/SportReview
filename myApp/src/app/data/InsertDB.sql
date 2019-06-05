INSERT INTO `SportReview`.`Position` (`latitude`, `longitude`, `altitude`) VALUES
(45.758387, 4.854627, 0),
(45.719437, 4.821907, 0),
(45.734227, 4.854627, 10),
(45.778217, 4.855237, 5),
(45.758387, 4.447217, 15),
(45.757127, 4.853817, 20);

INSERT INTO `SportReview`.`Training` (`sport`, `status`, `type`) VALUES
("running", True, "Distance"),
("bike", True, "Timer"),
("bike", True, "Timer"),
("walking", True, "Distance"),
("quick", True, "Timer"),
("running", True, "Distance");

INSERT INTO `SportReview`.`Tracking` (`positionId`, `date`, `trainingId`) VALUES
(1, "2019-06-04 10:00:00", 3),
(2, "2019-06-04 11:00:00", 3),
(3, "2019-06-04 12:00:00", 3),
(1, "2019-06-04 08:00:00", 1),
(5, "2019-06-04 10:00:00", 1),
(6, "2019-06-04 10:00:00", 1),
(4, "2019-06-04 10:00:00", 2);

INSERT INTO `SportReview`.`Segment` (`type`, `trainingId`, `distanceValue`, `durationValue`) VALUES
("duration", 1, NULL, 3600),
("distance", 2, 7, NULL),
("duration", 3, NULL, 4400),
("distance", 5, 11, NULL),
("duration", 4, NULL, 1200),
("distance", 3, 12, NULL);

INSERT INTO `SportReview`.`Segment_Tracking` (`segmentId`, `trackingId`) VALUES
(1, 2),
(2, 3),
(5, 5),
(3, 4),
(4, 6),
(6, 1);