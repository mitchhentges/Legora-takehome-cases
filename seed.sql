CREATE
EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users
(
    id            SERIAL PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT        NOT NULL
);

INSERT INTO users (email, password_hash)
VALUES ('a@a', crypt('testing_a', gen_salt('bf'))),
       ('b@b', crypt('testing_b', gen_salt('bf'))),
       ('c@c', crypt('testing_c', gen_salt('bf')));

CREATE TABLE messages
(
    id        SERIAL PRIMARY KEY,
    author    TEXT      NOT NULL,
    recipient TEXT      NOT NULL,
    content   TEXT      NOT NULL,
    sent_at   TIMESTAMP NOT NULL
);
CREATE INDEX idx_messages_from ON messages ("author");
CREATE INDEX idx_messages_to ON messages ("recipient");

INSERT INTO messages (author, recipient, content, sent_at)
VALUES
    ('b@b', 'a@a', 'yooo', to_timestamp(1)),
    ('a@a', 'b@b', 'My homie', to_timestamp(2)),
    ('c@c', 'a@a', 'gruggg', to_timestamp(3)),
    ('c@c', 'a@a', ':))', to_timestamp(4));