CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_message_id BIGINT NOT NULL,
    channel_username TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    image_url TEXT,
    telegram_link TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    UNIQUE(channel_username, telegram_message_id)
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_channel ON articles(channel_username);

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level TEXT NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES 
    ('site_title', 'Telegram News'),
    ('site_description', 'Latest news from Telegram'),
    ('articles_per_page', '12'),
    ('auto_publish', 'true'),
    ('ads_enabled', 'false'),
    ('ads_code_header', ''),
    ('ads_code_article', ''),
    ('google_analytics_id', ''),
    ('google_search_console', ''),
    ('footer_javascript', ''),
    ('seo_keywords', 'news, telegram, articles'),
    ('seo_author', 'Telegram News')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admin_users (username, password_hash) VALUES 
    ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqBmW1Uq4tJFqYJtXqQJzQJzQJzQJ')
ON CONFLICT (username) DO NOTHING;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_articles_updated ON articles;
CREATE TRIGGER trg_articles_updated BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_settings_updated ON settings;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published" ON articles FOR SELECT USING (is_published = TRUE);
CREATE POLICY "service_all" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_logs" ON system_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_settings" ON settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_admin" ON admin_users FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION increment_view_count(article_slug TEXT)
RETURNS VOID AS $$ BEGIN
    UPDATE articles SET view_count = view_count + 1 WHERE slug = article_slug;
END; $$ LANGUAGE plpgsql;
