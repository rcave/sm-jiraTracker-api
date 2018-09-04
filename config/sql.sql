CREATE TABLE `users` (
`userId` int(11) AUTO_INCREMENT NOT NULL,
`username` varchar(50) NOT NULL,
`firstname` varchar(100),
`lastname` varchar(100),
`email` varchar(200) NOT NULL,
`password` varchar(200) NOT NULL,
`jiraUsername` varchar(200) NOT NULL,
`slackUsername` varchar (200),
`secret` varchar(200) NOT NULL,
`isAdmin` boolean NOT NULL DEFAULT 0,
`tracked` boolean NOT NULL DEFAULT 0,
`created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
`modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`userId`)
);

CREATE TABLE `teams` (
`teamId` int(11) AUTO_INCREMENT NOT NULL,
`teamName` varchar(200) NOT NULL,
`slackChannel` varchar(200) NOT NULL,
`created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
`modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY (`teamID`)
);


CREATE TABLE `team_members` (
`userId` int(11) NOT NULL,
`teamId` int(11) NOT NULL,
`isTeamAdmin` boolean NOT NULL DEFAULT 0
);

CREATE TABLE `member_activity` (
`userId` int(11) NOT NULL, 
`jiraUsername` varchar(200) NOT NULL,
`ticketId` varchar(50),
`ticketActivity` text,
`ticketChanges` text,
`published` varchar(200),
`created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
`modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP
);