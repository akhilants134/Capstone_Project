const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/resourcematcher',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

let postgresConnected = false;

// Check connection and initialize normalized tables
const initPostgres = async () => {
  try {
    const client = await pool.connect();
    postgresConnected = true;
    console.log('✅ PostgreSQL connected successfully');

    // 1. Relational schema design with PK/FK, Normalization (3NF) & Indexing for query performance
    await client.query(`
      CREATE TABLE IF NOT EXISTS donors (
        id SERIAL PRIMARY KEY,
        mongo_user_id VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        total_donated_cents BIGINT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        category VARCHAR(50) NOT NULL,
        target_amount_cents BIGINT NOT NULL,
        collected_amount_cents BIGINT DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS monetary_transactions (
        id SERIAL PRIMARY KEY,
        donor_id INTEGER NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
        campaign_id INTEGER REFERENCES campaigns(id) ON DELETE SET NULL,
        amount_cents BIGINT NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        payment_gateway VARCHAR(30) DEFAULT 'stripe',
        gateway_payment_intent_id VARCHAR(120) UNIQUE,
        status VARCHAR(30) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100),
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Query Performance Indexes (SQL)
      CREATE INDEX IF NOT EXISTS idx_transactions_donor_id ON monetary_transactions(donor_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_campaign_id ON monetary_transactions(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_status_created ON monetary_transactions(status, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_campaigns_category_status ON campaigns(category, status);
      CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
    `);

    client.release();
  } catch (err) {
    postgresConnected = false;
    console.warn('⚠️ PostgreSQL not reachable or optional in dev mode. Features will gracefully fall back:', err.message);
  }
};

initPostgres();

module.exports = {
  pool,
  isPostgresConnected: () => postgresConnected,
  query: (text, params) => pool.query(text, params),
  
  // Transaction helper for ACID operations
  executeTransaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};
