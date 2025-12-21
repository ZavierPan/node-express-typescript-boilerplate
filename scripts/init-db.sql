-- Database initialization script for Docker
-- This script will be executed when MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS node_express_boilerplate;

-- Use the database
USE node_express_boilerplate;

-- Grant privileges to the user (if using non-root user)
-- GRANT ALL PRIVILEGES ON node_express_boilerplate.* TO 'your_user'@'%';
-- FLUSH PRIVILEGES;

-- Note: Tables will be created by TypeORM migrations
-- This script is just for initial database setup