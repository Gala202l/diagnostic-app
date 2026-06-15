import React, { useState } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

export default function DiagnosticApp() {
  const [stage, setStage] = useState('intro'); // intro, questions, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const questions = [
    { id: 'source', text: 'Проблема пришла извне или это ваша ошибка? (0° - внешние, 90° - вы)', type: 'slider', min: 0, max: 90 },
    { id: 'speed', text: 'Как быстро развивалась проблема? (0° - хронический, 90° - острый кризис)', type: 'slider', min: 0, max: 90 },
    { id: 'sphere', text: 'Где болит больше всего? (0° - финансы, 90° - репутация)', type: 'slider', min: 0, max: 90 },
    { id: 'burnout', text: 'Ваше выгорание (0 - отлично, 10 - совсем сгорел)', type: 'slider', min: 0, max: 10 },
    { id: 'belief', text: 'Верите ли вы в свой продукт/метод? (0 - нет, 10 - да)', type: 'slider', min: 0, max: 10 },
    { id: 'pleasure', text: 'Получаете ли удовольствие от работы? (0 - нет, 10 - да)', type: 'slider', min: 0, max: 10 },
    { id: 'clarity', text: 'Ясна ли вам ваша ниша и аудитория? (0 - нет, 10 - да)', type: 'slider', min: 0, max: 10 },
    { id: 'newClients', text: 'На сколько % упала база клиентов? (0-100%)', type: 'slider', min: 0, max: 100 },
    { id: 'sourceClients', text: 'Откуда берутся клиенты? (0° - рекомендации, 45° - реклама, 90° - случайно)', type: 'slider', min: 0, max: 90 },
    { id: 'marketing', text: 'Видимость в интернете (0 - не видны, 10 - активны)', type: 'slider', min: 0, max: 10 },
  ];

  const diagnoses = [
    { name: 'ВЫГОРАНИЕ', color: '#ff6b4a', desc: 'Внутреннее истощение, потеря энергии. Клиенты чувствуют вашу усталость.' },
    { name: 'МАРКЕТИНГ ПРОВАЛ', color: '#f97316', desc: 'Никто не знает о вас. Нужна реклама и позиционирование.' },
    { name: 'ПОЗИЦИОНИРОВАНИЕ', color: '#eab308', desc: 'Неясна ваша специализация. Нужна четкая ниша.' },
    { name: 'ОСТРЫЙ КРИЗИС', color: '#ef4444', desc: 'Все сразу упало. Нужны экстренные меры.' },
    { name: 'ВНЕШНИЙ УДАР', color: '#06b6d4', desc: 'Рынок изменился, конкуренты. Нужна адаптация.' },
    { name: 'СБАЛАНСИРОВАННЫЙ РОСТ', color: '#10b981', desc: 'Все в порядке, можно расширяться.' },
  ];

  const calculateResults = () => {
    const axis1 = parseInt(answers.source) || 0;
    const axis2 = parseInt(answers.speed) || 0;
    const axis3 = parseInt(answers.sphere) || 0;
    const burnout = parseInt(answers.burnout) || 0;
    const belief = parseInt(answers.belief) || 0;
    const pleasure = parseInt(answers.pleasure) || 0;
    const clarity = parseInt(answers.clarity) || 0;
    const newClients = parseInt(answers.newClients) || 0;

    let diagnosis = diagnoses[0];
    
    if (burnout >= 8) {
      diagnosis = diagnoses[0];
    } else if (axis1 < 30 && axis2 > 60) {
      diagnosis = diagnoses[4];
    } else if (clarity < 5 && axis1 < 40) {
      diagnosis = diagnoses[2];
    } else if (parseInt(answers.marketing) < 3 && newClients > 50) {
      diagnosis = diagnoses[1];
    } else if (axis2 > 75) {
      diagnosis = diagnoses[3];
    } else {
      diagnosis = diagnoses[5];
    }

    const radarData = [
      { axis: 'Источник (внутренний)', value: axis1, fullMark: 90 },
      { axis: 'Скорость (острая)', value: axis2, fullMark: 90 },
      { axis: 'Сфера (репутация)', value: axis3, fullMark: 90 },
    ];

    setResults({
      axis1, axis2, axis3, burnout, belief, pleasure, clarity, newClients,
      radarData, diagnosis,
      advice: generateAdvice({ axis1, axis2, axis3, burnout, belief, pleasure, clarity, newClients })
    });
    setStage('results');
  };

  const generateAdvice = (data) => {
    let advice = [];
    
    if (data.burnout >= 8) {
      advice.push('🔴 СРОЧНО: Возьмите перерыв минимум на неделю. Клиенты чувствуют вашу усталость.');
      advice.push('💪 Посетите супервизию или личную терапию (это инвестиция в вашу практику).');
    }
    
    if (data.axis1 > 70) {
      advice.push('⚠️ Проблема в основном внутри вас. Хорошая новость: вы можете это контролировать.');
    } else if (data.axis1 < 40) {
      advice.push('📊 Внешние факторы на вас давят. Нужна адаптация к новым условиям рынка.');
    }
    
    if (data.axis2 > 75) {
      advice.push('⏱️ ОСТРЫЙ КРИЗИС - нужны экстренные меры, не долгосрочное планирование.');
    } else if (data.axis2 < 30) {
      advice.push('📈 Проблема хроническая - есть время на системные изменения.');
    }
    
    if (data.newClients > 60) {
      advice.push('👥 Вы теряете основную базу. Срочно нужны изменения в том, как вы работаете.');
    }
    
    if (data.belief >= 8 && data.burnout >= 8) {
      advice.push('💡 Парадокс: вы верите в себя, но выгорели. Нужно восстановление, не переобучение.');
    }
    
    if (data.clarity < 5) {
      advice.push('🎯 Определите свою нишу четко. Это первый шаг к позиционированию.');
    }
    
    return advice;
  };

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white font-sans">
      {stage === 'intro' && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                DIAGNOSTIC 3.0
              </h1>
              <p className="text-xl text-gray-300 mb-8">Метод осей и углов для анализа бизнес-кризиса</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Что вы получите:</h2>
              <ul className="space-y-4 text-gray-200">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-4 font-bold">✓</span>
                  <span>Диагноз вашего кризиса на трех осях</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-4 font-bold">✓</span>
                  <span>Визуальную карту вашей проблемы</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-4 font-bold">✓</span>
                  <span>Персонализированные рекомендации</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-4 font-bold">✓</span>
                  <span>Понимание, что менять в первую очередь</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all"
            >
              Начать диагностику
            </button>
            <p className="text-center text-gray-400 text-sm mt-4">⏱️ Займет около 5 минут</p>
          </div>
        </div>
      )}

      {stage === 'questions' && (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-2xl w-full">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-300">Вопрос {currentQuestion + 1} из {questions.length}</h3>
                <div className="bg-indigo-900/50 px-4 py-2 rounded-full text-sm">
                  {Math.round((currentQuestion + 1) / questions.length * 100)}%
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${(currentQuestion + 1) / questions.length * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-8">{questions[currentQuestion].text}</h2>
              
              <div className="mb-8">
                <input
                  type="range"
                  min={questions[currentQuestion].min}
                  max={questions[currentQuestion].max}
                  value={answers[questions[currentQuestion].id] || 0}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between mt-4 text-sm text-gray-400">
                  <span>0</span>
                  <span className="text-orange-400 font-bold text-lg">{answers[questions[currentQuestion].id] || 0}</span>
                  <span>{questions[currentQuestion].max}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                ← Назад
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                {currentQuestion === questions.length - 1 ? 'Получить результаты' : 'Далее →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'results' && results && (
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Ваши результаты</h1>
              <p className="text-gray-300">Диагноз вашей ситуации</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border-2 rounded-2xl p-8 mb-12" style={{ borderColor: results.diagnosis.color }}>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: results.diagnosis.color }}
                />
                <h2 className="text-3xl font-bold" style={{ color: results.diagnosis.color }}>
                  {results.diagnosis.name}
                </h2>
              </div>
              <p className="text-lg text-gray-200">{results.diagnosis.desc}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Координаты на осях</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={results.radarData}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 90]} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                    <Radar name="Ваше состояние" dataKey="value" stroke="#ff6b4a" fill="#ff6b4a" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Значения осей</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Ось 1 (Источник): Внешнее ← → Внутреннее</span>
                      <span className="text-orange-400 font-bold">{results.axis1}°</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${results.axis1}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Ось 2 (Скорость): Хронический ← → Острый</span>
                      <span className="text-orange-400 font-bold">{results.axis2}°</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${results.axis2}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Ось 3 (Сфера): Финансы ← → Репутация</span>
                      <span className="text-orange-400 font-bold">{results.axis3}°</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${results.axis3}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-12">
              <h3 className="text-xl font-bold mb-6">Ваше состояние</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Выгорание', value: results.burnout, max: 10, color: results.burnout > 7 ? '#ff6b4a' : '#10b981' },
                  { label: 'Вера в себя', value: results.belief, max: 10, color: results.belief > 6 ? '#10b981' : '#f97316' },
                  { label: 'Удовольствие', value: results.pleasure, max: 10, color: results.pleasure > 6 ? '#10b981' : '#f97316' },
                  { label: 'Ясность ниши', value: results.clarity, max: 10, color: results.clarity > 6 ? '#10b981' : '#f97316' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-slate-700/50 rounded-xl">
                    <div className="text-3xl font-bold mb-2" style={{ color: item.color }}>
                      {item.value}/{item.max}
                    </div>
                    <div className="text-sm text-gray-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Рекомендации</h3>
              <div className="space-y-4">
                {results.advice.map((rec, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-700/50 rounded-xl">
                    <span className="text-2xl">•</span>
                    <p className="text-gray-200">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur border border-orange-500/50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Нужен подробный план действий?</h3>
              <p className="text-gray-300 mb-6">Забронируйте консультацию и получите детальную стратегию выхода из кризиса</p>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl">
                Забронировать консультацию
              </button>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setStage('intro');
                  setCurrentQuestion(0);
                  setAnswers({});
                  setResults(null);
                }}
                className="text-gray-400 hover:text-gray-300 underline"
              >
                ← Начать заново
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
