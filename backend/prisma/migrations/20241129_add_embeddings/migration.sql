-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable for RAG Embeddings
CREATE TABLE IF NOT EXISTS "embeddings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "collection" TEXT NOT NULL DEFAULT 'documents',
    "embedding" vector(1536),
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for vector similarity search
CREATE INDEX IF NOT EXISTS "embeddings_embedding_idx" ON "embeddings" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- CreateIndex for collection filtering
CREATE INDEX IF NOT EXISTS "embeddings_collection_idx" ON "embeddings"("collection");

-- CreateIndex for source lookup
CREATE INDEX IF NOT EXISTS "embeddings_source_idx" ON "embeddings"("source");

-- CreateTable for LLM Response Cache
CREATE TABLE IF NOT EXISTS "llm_cache" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cache_key" TEXT NOT NULL,
    "prompt_hash" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "tokens_used" INTEGER,
    "generation_time_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "llm_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for cache lookup
CREATE UNIQUE INDEX IF NOT EXISTS "llm_cache_cache_key_key" ON "llm_cache"("cache_key");
CREATE INDEX IF NOT EXISTS "llm_cache_expires_at_idx" ON "llm_cache"("expires_at");

-- CreateTable for Query Classifications (for learning optimal routing)
CREATE TABLE IF NOT EXISTS "query_classifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "query_hash" TEXT NOT NULL,
    "query_preview" TEXT NOT NULL,
    "classified_type" TEXT NOT NULL,
    "classified_complexity" TEXT NOT NULL,
    "classified_domain" TEXT[] NOT NULL,
    "suggested_model" TEXT NOT NULL,
    "actual_model_used" TEXT,
    "response_quality_score" DOUBLE PRECISION,
    "user_feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "query_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for classification lookup
CREATE INDEX IF NOT EXISTS "query_classifications_query_hash_idx" ON "query_classifications"("query_hash");
CREATE INDEX IF NOT EXISTS "query_classifications_type_idx" ON "query_classifications"("classified_type");

-- CreateTable for Model Performance Tracking
CREATE TABLE IF NOT EXISTS "model_performance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "model" TEXT NOT NULL,
    "agent_id" TEXT,
    "query_type" TEXT NOT NULL,
    "response_time_ms" INTEGER NOT NULL,
    "tokens_generated" INTEGER,
    "quality_score" DOUBLE PRECISION,
    "was_cached" BOOLEAN NOT NULL DEFAULT false,
    "used_rag" BOOLEAN NOT NULL DEFAULT false,
    "used_cot" BOOLEAN NOT NULL DEFAULT false,
    "used_ensemble" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_performance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for performance analysis
CREATE INDEX IF NOT EXISTS "model_performance_model_idx" ON "model_performance"("model");
CREATE INDEX IF NOT EXISTS "model_performance_created_at_idx" ON "model_performance"("created_at");
CREATE INDEX IF NOT EXISTS "model_performance_agent_idx" ON "model_performance"("agent_id");

-- Add comment
COMMENT ON TABLE embeddings IS 'Vector embeddings for RAG (Retrieval Augmented Generation)';
COMMENT ON TABLE llm_cache IS 'Response cache for LLM queries to reduce redundant calls';
COMMENT ON TABLE query_classifications IS 'Query classification history for model routing optimization';
COMMENT ON TABLE model_performance IS 'Model performance metrics for adaptive routing';
