'use client';

import { useState } from 'react';

interface StepQuestionsProps {
  taskId: string;
  questions: string[];
  onNext: (data: { preview: string }) => void;
}

export function StepQuestions({ taskId, questions, onNext }: StepQuestionsProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks/${taskId}/submit-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) throw new Error('Failed to submit');

      const data = await response.json();
      onNext({ preview: data.preview });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-2">
        A few quick questions
      </h2>
      <p className="text-slate-400 mb-6">
        This helps our AI handle your call correctly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((question, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {question}
            </label>
            <input
              type="text"
              value={answers[index] || ''}
              onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}