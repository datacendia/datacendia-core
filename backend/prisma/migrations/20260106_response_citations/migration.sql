-- CreateTable: response_citations
-- Stores RAG evidence citations linked to agent responses
-- This makes evidence citations REAL, not simulated

CREATE TABLE IF NOT EXISTS response_citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL,
    source_type VARCHAR(50) NOT NULL DEFAULT 'document',
    source_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    similarity_score DECIMAL(5,4) NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- Note: response_id is a soft reference to deliberation_messages.id or chain_of_thought_logs.id
    -- No FK constraint since responses can come from multiple tables
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_response_citations_response_id ON response_citations(response_id);
CREATE INDEX IF NOT EXISTS idx_response_citations_source_type ON response_citations(source_type);
CREATE INDEX IF NOT EXISTS idx_response_citations_similarity ON response_citations(similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_response_citations_content_hash ON response_citations(content_hash);

-- Comment explaining the table
COMMENT ON TABLE response_citations IS 'Real evidence citations from RAG retrieval, linked to agent responses. Each citation includes the actual source content, similarity score, and cryptographic hash for verification.';
