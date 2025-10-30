CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    style VARCHAR(100),
    sections TEXT,
    colors JSONB,
    html_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_session_id ON projects(session_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);