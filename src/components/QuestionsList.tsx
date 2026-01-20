import { useEffect, useState } from 'react';
import { Trash2, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { supabase, type Question } from '../lib/supabase';

interface QuestionsListProps {
  refresh: number;
}

export function QuestionsList({ refresh }: QuestionsListProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [refresh]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Ошибка загрузки вопросов:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadQuestions();
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот вопрос?')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadQuestions();
    } catch (err) {
      console.error('Ошибка удаления вопроса:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-900">Список вопросов</h2>
        <span className="ml-auto bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
          {questions.length} вопросов
        </span>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Вопросы еще не созданы</p>
          <p className="text-gray-400 text-sm mt-2">Создайте первый вопрос с помощью формы выше</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      question.question_type === 'text'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {question.question_type === 'text' ? 'Текст' : 'Выбор'}
                    </span>
                    {question.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle size={16} />
                        Активен
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                        <XCircle size={16} />
                        Неактивен
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {question.question_text}
                  </h3>

                  {question.question_type === 'multiple_choice' && question.options && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-600 mb-2">Варианты ответов:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.options.map((option, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              option === question.correct_answer
                                ? 'bg-green-100 text-green-700 font-semibold'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Правильный ответ:</span>{' '}
                    <span className="text-green-600 font-semibold">{question.correct_answer}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(question.id, question.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      question.is_active
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={question.is_active ? 'Деактивировать' : 'Активировать'}
                  >
                    {question.is_active ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </button>
                  <button
                    onClick={() => deleteQuestion(question.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
