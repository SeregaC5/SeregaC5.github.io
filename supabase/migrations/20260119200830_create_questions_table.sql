/*
  # Создание таблицы вопросов для верификации

  1. Новые таблицы
    - `questions`
      - `id` (uuid, primary key) - уникальный идентификатор вопроса
      - `question_text` (text) - текст вопроса
      - `question_type` (text) - тип вопроса (text, multiple_choice)
      - `correct_answer` (text) - правильный ответ
      - `options` (jsonb) - варианты ответов для multiple choice
      - `is_active` (boolean) - активен ли вопрос
      - `created_at` (timestamptz) - дата создания
      - `updated_at` (timestamptz) - дата обновления

  2. Безопасность
    - Включить RLS для таблицы `questions`
    - Добавить политики для чтения и управления вопросами
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'text',
  correct_answer text NOT NULL,
  options jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active questions"
  ON questions
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(is_active);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);