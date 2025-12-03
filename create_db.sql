# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));


 CREATE TABLE IF NOT EXISTS users (
    id             INT AUTO_INCREMENT,
    username       VARCHAR(30) UNIQUE,
    first          VARCHAR(30),
    last           VARCHAR(30),
    email          VARCHAR(50) UNIQUE,
    hashedPassword VARCHAR(255),
    PRIMARY KEY(id));

 CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30),
    success TINYINT(1),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
 );


    -- Creating application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';


