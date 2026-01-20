import { useState } from 'react';
import { Shield, Bot } from 'lucide-react';
import { QuestionForm } from './components/QuestionForm';
import { QuestionsList } from './components/QuestionsList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleQuestionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl">
              <Bot className="text-white" size={40} />
            </div>
            <Shield className="text-blue-600" size={48} />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Панель управления
          </h1>
          <p className="text-xl text-gray-600">
            Telegram бот проверки личности
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-white rounded-full shadow-md border border-gray-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Система активна</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <QuestionForm onQuestionAdded={handleQuestionAdded} />

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
            <Shield className="mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-4">О системе верификации</h2>
            <div className="space-y-4 text-blue-50">
              <p>
                Создавайте вопросы для проверки личности пользователей в Telegram боте.
              </p>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-2 text-white">Типы вопросов:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">•</span>
                    <span><strong>Текстовый ответ</strong> - пользователь вводит ответ свободно</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-300">•</span>
                    <span><strong>Множественный выбор</strong> - пользователь выбирает из вариантов</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm">
                Все вопросы сохраняются в безопасной базе данных и могут быть активированы или деактивированы по необходимости.
              </p>
            </div>
          </div>
        </div>

        <QuestionsList refresh={refreshKey} />
      </div>
    </div>
  );
}

export default App;
