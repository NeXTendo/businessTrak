-- ============================================================
-- Migration 001: Extensions
-- Run first — enables UUID and pgcrypto functions
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
