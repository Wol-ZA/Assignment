# Assignment

Main coding section of the Iclix assignment given 16/09/22.

Schema Information:

Schema:


CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    user_name VARCHAR(20) NOT NULL,
    user_surname VARCHAR(25) NOT NULL,
    user_email VARCHAR(30) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_hasContributed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(user_id)
);

CREATE TABLE notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    note_subject VARCHAR(40),
    note_content VARCHAR(1000),
    note_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


I have added a register button to insert data directly to MySQL but for convenience I have Dummy data below to use.
Insert a User:


INSERT INTO users (user_name,user_surname,user_email,user_password,user_hasContributed)
VALUES('John','Doe','johan@Doe.com','$2b$10$5ckk.v9qoDGOAXslUdPSI.TVWzmlRhPoLIc27RLmhPZgwp2/20.wK', FALSE);

UserName – John@Doe.com
Password – 123

