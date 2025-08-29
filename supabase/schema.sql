-- =============================================================================
-- EDUGENIUS SUPABASE DATABASE SCHEMA
-- =============================================================================
-- This file contains the SQL scripts to set up the database schema for 
-- EduGenius realtime features in Supabase.
-- 
-- Instructions:
-- 1. Go to your Supabase dashboard
-- 2. Navigate to SQL Editor
-- 3. Run these scripts in order
-- =============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE user_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE user_stats;

-- =============================================================================
-- 1. NOTIFICATIONS TABLE
-- =============================================================================
-- Store real-time notifications for users
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert their own notifications" ON notifications
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = current_setting('app.user_id', true));

-- =============================================================================
-- 2. CHAT MESSAGES TABLE
-- =============================================================================
-- Store real-time chat messages and AI responses
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ai_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own chat messages" ON chat_messages
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own chat messages" ON chat_messages
    FOR UPDATE USING (user_id = current_setting('app.user_id', true));

-- =============================================================================
-- 3. USER ACTIVITIES TABLE
-- =============================================================================
-- Track real-time user activities and engagement with enhanced structure
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL CHECK (activity_type IN (
        'test_completed', 'summary_created', 'study_session', 'login', 'chapter_read', 'video_watched'
    )),
    activity_data JSONB DEFAULT '{}',
    date DATE DEFAULT CURRENT_DATE, -- For easy date-based querying
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_date ON user_activities(date);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_data ON user_activities USING GIN(activity_data);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own activities" ON user_activities
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert their own activities" ON user_activities
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

-- =============================================================================
-- 4. USER STATISTICS TABLE
-- =============================================================================
-- Comprehensive user statistics for dashboard
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    tests_completed INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    summaries_created INTEGER DEFAULT 0,
    study_streak_days INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    total_study_time INTEGER DEFAULT 0, -- in minutes
    monthly_tests INTEGER DEFAULT 0,
    monthly_score INTEGER DEFAULT 0,
    weekly_summaries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_stats
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_last_activity ON user_stats(last_activity_date);

-- Enable RLS for user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats" ON user_stats
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert their own stats" ON user_stats
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own stats" ON user_stats
    FOR UPDATE USING (user_id = current_setting('app.user_id', true));

-- =============================================================================
-- 5. STUDY SESSIONS TABLE
-- =============================================================================
-- Track real-time study sessions and progress
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    duration INTEGER DEFAULT 0, -- Duration in minutes
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_status ON study_sessions(status);
CREATE INDEX IF NOT EXISTS idx_study_sessions_subject ON study_sessions(subject);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started_at ON study_sessions(started_at);

-- Enable RLS
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own study sessions" ON study_sessions
    FOR SELECT USING (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can insert their own study sessions" ON study_sessions
    FOR INSERT WITH CHECK (user_id = current_setting('app.user_id', true));

CREATE POLICY "Users can update their own study sessions" ON study_sessions
    FOR UPDATE USING (user_id = current_setting('app.user_id', true));

-- =============================================================================
-- 5. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================================================
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at 
    BEFORE UPDATE ON chat_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at 
    BEFORE UPDATE ON study_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at 
    BEFORE UPDATE ON user_stats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 6. SAMPLE DATA (OPTIONAL)
-- =============================================================================
-- Insert some sample data for testing (uncomment if needed)

-- Sample notifications
-- INSERT INTO notifications (user_id, title, message, type) VALUES 
-- ('user_1', 'Welcome to EduGenius!', 'Your AI learning journey begins now.', 'success'),
-- ('user_1', 'New Feature Available', 'Check out our new realtime chat feature!', 'info'),
-- ('user_1', 'Study Reminder', 'Don''t forget your daily study session.', 'warning');

-- Sample chat messages
-- INSERT INTO chat_messages (user_id, message, ai_response) VALUES 
-- ('user_1', 'What is photosynthesis?', 'Photosynthesis is the process by which plants convert light energy into chemical energy...'),
-- ('user_1', 'Explain quantum mechanics', 'Quantum mechanics is a fundamental theory in physics that describes the behavior of matter and energy at the atomic and subatomic level...');

-- Sample user activities
-- INSERT INTO user_activities (user_id, activity_type, activity_data) VALUES 
-- ('user_1', 'page_view', '{"page": "/dashboard", "timestamp": "2024-01-15T10:30:00Z"}'),
-- ('user_1', 'search_query', '{"query": "mathematics", "results_count": 15}'),
-- ('user_1', 'video_watch', '{"video_id": "math_101", "duration": 1200}');

-- Sample study sessions
-- INSERT INTO study_sessions (user_id, subject, duration, status) VALUES 
-- ('user_1', 'Mathematics', 45, 'completed'),
-- ('user_1', 'Physics', 30, 'active'),
-- ('user_1', 'Chemistry', 60, 'completed');

-- =============================================================================
-- 7. ENABLE REALTIME FOR ALL TABLES
-- =============================================================================
-- Make sure realtime is enabled for all our tables
SELECT supabase_realtime.enable('notifications');
SELECT supabase_realtime.enable('chat_messages');
SELECT supabase_realtime.enable('user_activities');
SELECT supabase_realtime.enable('study_sessions');
SELECT supabase_realtime.enable('user_stats');

-- =============================================================================
-- SETUP COMPLETE!
-- =============================================================================
-- Your Supabase database is now configured for realtime functionality with EduGenius.
-- 
-- Next steps:
-- 1. Update your .env.local file with your actual Supabase URL and keys
-- 2. Test the connection by running the application
-- 3. Use the provided React hooks to interact with realtime data
-- =============================================================================