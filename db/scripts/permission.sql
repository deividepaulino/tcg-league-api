-- Tabela de Permissões
CREATE TABLE permissoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acao TEXT NOT NULL UNIQUE
);

-- Tabela de Associação entre Usuários e Permissões
CREATE TABLE usuarios_permissoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    permissao_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (permissao_id) REFERENCES permissoes(id)
);
