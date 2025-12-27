-- =========================================================
-- seeds.sql
-- Données initiales pour développement et tests
-- Plateforme de gestion des abonnements
-- =========================================================

-- =========================
-- ROLES
-- =========================
-- On insère les rôles uniquement s’ils n’existent pas déjà
INSERT INTO roles (name)
VALUES
    ('ADMIN'),
    ('USER')
ON CONFLICT (name) DO NOTHING;

-- =========================
-- USERS
-- =========================
-- Administrateur
INSERT INTO users (email, password_hash, role_id)
VALUES (
    'admin@newsletter.dev',
    '$2b$12$abcdefghijklmnopqrstuv', -- hash fictif
    (SELECT id FROM roles WHERE name = 'ADMIN')
)
ON CONFLICT (email) DO NOTHING;

-- Utilisateur standard (gratuit)
INSERT INTO users (email, password_hash, role_id)
VALUES (
    'user1@newsletter.dev',
    '$2b$12$abcdefghijklmnopqrstuv',
    (SELECT id FROM roles WHERE name = 'USER')
)
ON CONFLICT (email) DO NOTHING;

-- Utilisateur standard (premium)
INSERT INTO users (email, password_hash, role_id)
VALUES (
    'user2@newsletter.dev',
    '$2b$12$abcdefghijklmnopqrstuv',
    (SELECT id FROM roles WHERE name = 'USER')
)
ON CONFLICT (email) DO NOTHING;

-- =========================
-- SUBSCRIPTIONS
-- =========================
-- Abonnement FREE pour user1
INSERT INTO subscriptions (user_id, start_date, status)
VALUES (
    (SELECT id FROM users WHERE email = 'user1@newsletter.dev'),
    CURRENT_DATE,
    'FREE'
);

-- Abonnement PAID pour user2
INSERT INTO subscriptions (user_id, start_date, status)
VALUES (
    (SELECT id FROM users WHERE email = 'user2@newsletter.dev'),
    CURRENT_DATE,
    'PAID'
);

