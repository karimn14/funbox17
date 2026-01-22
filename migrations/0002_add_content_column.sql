-- Add content column to modules table for FunBox gamification
ALTER TABLE modules ADD COLUMN IF NOT EXISTS content JSONB;

-- Add comment for documentation
COMMENT ON COLUMN modules.content IS 'FunBox gamification content structure with openingText, videoUrl, activity, quiz, and closingText';

-- Create index on content column for better query performance
CREATE INDEX IF NOT EXISTS idx_modules_content ON modules USING gin(content);
