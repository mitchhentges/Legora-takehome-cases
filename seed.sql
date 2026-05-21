CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL
);

INSERT INTO users (email)
VALUES
    ('foo@app.com');