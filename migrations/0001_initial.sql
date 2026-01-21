-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Create students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create modules table
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  category TEXT NOT NULL,
  questions JSONB NOT NULL
);

-- Create quiz_results table
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  stars INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraints (optional but recommended)
ALTER TABLE quiz_results 
  ADD CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

ALTER TABLE quiz_results 
  ADD CONSTRAINT fk_module FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX idx_quiz_results_student_id ON quiz_results(student_id);
CREATE INDEX idx_quiz_results_module_id ON quiz_results(module_id);
CREATE INDEX idx_quiz_results_completed_at ON quiz_results(completed_at DESC);
