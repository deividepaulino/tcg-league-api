CREATE TABLE token (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    data_criacao TEXT DEFAULT (datetime('now')),
    data_expiracao TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
