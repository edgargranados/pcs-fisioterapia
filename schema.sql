CREATE TABLE IF NOT EXISTS stages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  position INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY stages_position_idx (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(120) NULL,
  locale VARCHAR(2) NOT NULL,
  page VARCHAR(180) NULL,
  preference VARCHAR(16) NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'complete',
  resume_token VARCHAR(64) NULL,
  referrer VARCHAR(500) NULL,
  landing_url VARCHAR(500) NULL,
  utm_source VARCHAR(120) NULL,
  utm_medium VARCHAR(120) NULL,
  utm_campaign VARCHAR(180) NULL,
  utm_term VARCHAR(180) NULL,
  utm_content VARCHAR(180) NULL,
  gclid VARCHAR(200) NULL,
  fbclid VARCHAR(200) NULL,
  gbraid VARCHAR(200) NULL,
  wbraid VARCHAR(200) NULL,
  msclkid VARCHAR(200) NULL,
  ttclid VARCHAR(200) NULL,
  stage_id INT UNSIGNED NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY leads_created_at_idx (created_at),
  KEY leads_stage_idx (stage_id),
  KEY leads_sort_idx (stage_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lead_notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT UNSIGNED NOT NULL,
  body VARCHAR(2000) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY lead_notes_lead_idx (lead_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lead_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  lead_id BIGINT UNSIGNED NOT NULL,
  kind VARCHAR(24) NOT NULL,
  detail VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY lead_events_lead_idx (lead_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
