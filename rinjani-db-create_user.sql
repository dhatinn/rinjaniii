-- RINJANI: Create database, DB user and optional admin table
-- Replace 'admin_password_here' and 'rinjani_admin' as needed.

-- 1) Create database
CREATE DATABASE IF NOT EXISTS db_rinjani CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 2) Create a dedicated MySQL user for the application (limited to localhost)
--    Change 'localhost' to '%' if you need remote access (be cautious).
CREATE USER IF NOT EXISTS 'rinjani_admin'@'localhost' IDENTIFIED BY 'dhatinadmin';

-- 3) Grant necessary privileges on the application database
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, ALTER ON db_rinjani.* TO 'rinjani_admin'@'localhost';

FLUSH PRIVILEGES;

-- ------------------------------------------------------------------
-- Optional: create an application-level users table to store admin accounts
-- Warning: the frontend currently uses a hardcoded password; implementing
-- DB-backed admin auth requires backend changes to validate credentials.
-- ------------------------------------------------------------------

USE db_rinjani;

CREATE TABLE IF NOT EXISTS app_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Example insert (replace the password_hash with a bcrypt hash):
-- To create a bcrypt hash locally using Node.js:
--   node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('your_admin_password', 10));"
-- Then paste the printed hash below.

INSERT INTO app_users (username, password_hash, role) VALUES
('admin', '$2b$12$.NQqR1GzpEqTiqLrqkkkt.8of6z1eTyqdMlZCQB2vJH6ELNiJP4IO', 'admin');

-- End of script
