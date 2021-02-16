CREATE DATABASE usof_db;
\c usof_db;
CREATE TABLE categories (
    /*1*/
    id BIGSERIAL PRIMARY KEY,
    title TEXT UNIQUE,
    descript TEXT
);
CREATE TABLE users(
    /*1*/
    id BIGSERIAL PRIMARY KEY,
    login VARCHAR(60) UNIQUE,
    password VARCHAR(60),
    email VARCHAR(255) UNIQUE,
    email_confirm boolean DEFAULT false,
    fullname varchar(60),
    profilepic VARCHAR(255),
    role VARCHAR(60),
    rating INTEGER DEFAULT 0
);
CREATE TABLE posts(
    /*1*/
    id BIGSERIAL PRIMARY KEY,
    author VARCHAR(60),
    author_id BIGINT,
    title TEXT,
    pubdate DATE DEFAULT NOW(),
    status boolean default true,
    content TEXT,
    category TEXT[],
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION
);
CREATE TABLE comments(
    /*1*/
    id BIGSERIAL PRIMARY KEY,
    author VARCHAR(60),
    author_id BIGINT,
    pubdate DATE DEFAULT NOW(),
    content TEXT,
    post_id BIGINT,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE NO ACTION
);
CREATE TABLE likes(
    /*1*/
    id BIGSERIAL PRIMARY KEY,
    author VARCHAR(60),
    pubdate DATE DEFAULT NOW(),
    selftype boolean,
    author_id BIGINT,
    post_id BIGINT DEFAULT NULL,
    comment_id BIGINT DEFAULT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE NO ACTION
);