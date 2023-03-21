-- Active: 1678462263454@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT "NORMAL" NOT NULL,
    created_at TEXT DEFAULT (DATETIME('now', 'localtime')) NOT NULL
);
CREATE TABLE posts (
    id TEXT PRIMARY KEY NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0),
    dislikes INTEGER DEFAULT(0),
    created_at TEXT DEFAULT (DATETIME('now', 'localtime')) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME('now', 'localtime')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER DEFAULT(0),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE reply_posts (
    id TEXT PRIMARY KEY NOT NULL,
    post_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INT DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    reply TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
DROP TABLE reply_posts;
INSERT INTO reply_posts (id, post_id, creator_id, reply)
VALUES ("r001", "p001", "u002", "Resposta ao comentário 01"),
    ("r002", "p001", "u002", "Outra resposta ao comentário 01");

INSERT INTO users (id, name, email, password, role)
VALUES
	("u001", "Fulano", "fulano@email.com", "fulano123", "NORMAL"),
	("u002", "Beltrana", "beltrana@email.com", "beltrana00", "NORMAL"),
	("u003", "Astrodev", "astrodev@email.com", "astrodev99", "ADMIN");
SELECT*FROM users;
SELECT*FROM reply_posts;
