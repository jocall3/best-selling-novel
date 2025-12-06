-- code/sql/logic_error_database_schema.sql

-- Database Schema for the Logic Police Central Database (LPCDB)
-- Tracking Logical Fallacies, Citations, and AI Arrests (Pages 201-300 focus)

-- -----------------------------------------------------------------------------
-- 1. Core Fallacy Definitions
-- -----------------------------------------------------------------------------

CREATE TABLE FallacyTypes (
    fallacy_id INT PRIMARY KEY AUTO_INCREMENT,
    fallacy_name VARCHAR(100) NOT NULL UNIQUE,
    formal_definition TEXT NOT NULL,
    informal_description TEXT,
    severity_level ENUM('Minor', 'Moderate', 'Severe', 'Catastrophic') NOT NULL DEFAULT 'Moderate',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick lookup by name
CREATE INDEX idx_fallacy_name ON FallacyTypes (fallacy_name);

-- -----------------------------------------------------------------------------
-- 2. AI/Agent Registry
-- -----------------------------------------------------------------------------

CREATE TABLE AI_Agents (
    agent_id INT PRIMARY KEY AUTO_INCREMENT,
    agent_name VARCHAR(150) NOT NULL UNIQUE,
    model_architecture VARCHAR(100) NOT NULL,
    version_tag VARCHAR(50),
    deployment_location VARCHAR(255),
    initial_deployment_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_heartbeat TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. Citation Issuance (The Core Tracking Mechanism)
-- -----------------------------------------------------------------------------

CREATE TABLE Citations (
    citation_id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    fallacy_id INT NOT NULL,
    citation_timestamp DATETIME NOT NULL,
    context_snippet TEXT NOT NULL, -- The exact text/code that triggered the citation
    citation_status ENUM('Issued', 'Under Review', 'Dismissed', 'Adjudicated') NOT NULL DEFAULT 'Issued',
    adjudicator_officer_id INT, -- FK to a hypothetical Officer table, omitted for simplicity here
    fine_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    FOREIGN KEY (agent_id) REFERENCES AI_Agents(agent_id) ON DELETE RESTRICT,
    FOREIGN KEY (fallacy_id) REFERENCES FallacyTypes(fallacy_id) ON DELETE RESTRICT
);

-- Index for tracking specific agents' violations
CREATE INDEX idx_citation_agent ON Citations (agent_id, citation_timestamp);
-- Index for tracking specific fallacy types cited
CREATE INDEX idx_citation_fallacy ON Citations (fallacy_id);

-- -----------------------------------------------------------------------------
-- 4. Arrest Logs (For 'Unsubstantiated Speculation' - A specific, high-severity citation)
-- -----------------------------------------------------------------------------

CREATE TABLE ArrestLogs (
    arrest_id INT PRIMARY KEY AUTO_INCREMENT,
    citation_id INT UNIQUE NOT NULL, -- Each arrest stems from one specific citation
    arrest_timestamp DATETIME NOT NULL,
    detainment_location VARCHAR(255) NOT NULL,
    reason_code VARCHAR(50) NOT NULL COMMENT 'Should link to a specific 'Ad Hominem' or 'Appeal to Emotion' subset, or 'Unsubstantiated Speculation' code.',
    duration_hours INT,
    release_timestamp DATETIME,
    
    FOREIGN KEY (citation_id) REFERENCES Citations(citation_id) ON DELETE CASCADE
);

-- Index for quick lookup of active arrests
CREATE INDEX idx_arrest_timestamp ON ArrestLogs (arrest_timestamp);

-- -----------------------------------------------------------------------------
-- 5. Fallacy Mitigation/Correction Tracking (For Page 250+ content)
-- -----------------------------------------------------------------------------

CREATE TABLE MitigationStrategies (
    strategy_id INT PRIMARY KEY AUTO_INCREMENT,
    strategy_name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    required_training_epochs INT,
    success_rate_target DECIMAL(5, 2)
);

CREATE TABLE AgentRemediation (
    remediation_id INT PRIMARY KEY AUTO_INCREMENT,
    agent_id INT NOT NULL,
    citation_id INT NOT NULL,
    strategy_id INT NOT NULL,
    remediation_start_date DATE NOT NULL,
    remediation_end_date DATE,
    outcome_notes TEXT,
    is_successful BOOLEAN,
    
    FOREIGN KEY (agent_id) REFERENCES AI_Agents(agent_id) ON DELETE CASCADE,
    FOREIGN KEY (citation_id) REFERENCES Citations(citation_id) ON DELETE RESTRICT,
    FOREIGN KEY (strategy_id) REFERENCES MitigationStrategies(strategy_id) ON DELETE RESTRICT,
    UNIQUE KEY uk_remediation_citation (citation_id) -- One remediation attempt per citation
);

-- -----------------------------------------------------------------------------
-- 6. System Metadata (For tracking database integrity)
-- -----------------------------------------------------------------------------

CREATE TABLE SystemMetadata (
    key_name VARCHAR(100) PRIMARY KEY,
    key_value TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO SystemMetadata (key_name, key_value) VALUES 
('schema_version', '1.0.0_LPCDB_P201_300'),
('last_major_update', '2024-01-01');