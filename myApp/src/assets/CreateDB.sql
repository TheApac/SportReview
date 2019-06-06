--CREATE DATABASE IF NOT EXISTS SportReview;

DROP TABLE IF EXISTS Training;
DROP TABLE IF EXISTS Segment;
DROP TABLE IF EXISTS Tracking;
DROP TABLE IF EXISTS Position;
DROP TABLE IF EXISTS Segment_Tracking;

CREATE TABLE Position
(id INTEGER PRIMARY KEY,
latitude DOUBLE,
longitude DOUBLE,
altitude DOUBLE);

CREATE TABLE Training
(id INTEGER PRIMARY KEY,
sport VARCHAR(50),
status BOOLEAN,
type VARCHAR(50));

CREATE TABLE Tracking
(id INTEGER PRIMARY KEY,
positionId LONG,
date DATETIME,
trainingId LONG,
FOREIGN KEY(positionId) REFERENCES Position(id),
FOREIGN KEY(trainingId) REFERENCES Training(id));

CREATE TABLE Segment
(id INTEGER PRIMARY KEY,
type VARCHAR(50),
trainingId LONG,
distanceValue LONG,
durationValue LONG,
FOREIGN KEY(trainingId) REFERENCES Training(id));

CREATE TABLE Segment_Tracking
(segmentId LONG NOT NULL,
trackingId LONG NOT NULL,
FOREIGN KEY(segmentId) REFERENCES Segment(id),
FOREIGN KEY(trackingId) REFERENCES Tracking(id)
PRIMARY KEY (segmentId, trackingId));

INSERT or IGNORE INTO Position (latitude, longitude, altitude) VALUES
(45.758387, 4.854627, 0),
(45.719437, 4.821907, 0),
(45.734227, 4.854627, 10),
(45.778217, 4.855237, 5),
(45.758387, 4.447217, 15),
(45.757127, 4.853817, 20);

INSERT or IGNORE INTO Training (sport, status, type) VALUES
("running", True, "Distance"),
("bike", True, "Timer"),
("bike", True, "Timer"),
("walking", True, "Distance"),
("quick", True, "Timer"),
("running", True, "Distance");

INSERT or IGNORE INTO Tracking (positionId, date, trainingId) VALUES
(1, "2019-06-04 10:00:00", 3),
(2, "2019-06-04 11:00:00", 3),
(3, "2019-06-04 12:00:00", 3),
(1, "2019-06-04 08:00:00", 1),
(5, "2019-06-04 10:00:00", 1),
(6, "2019-06-04 10:00:00", 1),
(4, "2019-06-04 10:00:00", 2);

INSERT or IGNORE INTO Segment (type, trainingId, distanceValue, durationValue) VALUES
("duration", 1, NULL, 3600),
("distance", 2, 7, NULL),
("duration", 3, NULL, 4400),
("distance", 5, 11, NULL),
("duration", 4, NULL, 1200),
("distance", 3, 12, NULL);

INSERT or IGNORE INTO Segment_Tracking (segmentId, trackingId) VALUES
(1, 2),
(2, 3),
(5, 5),
(3, 4),
(4, 6),
(6, 1);
