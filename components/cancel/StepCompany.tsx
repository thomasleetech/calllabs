'use client';

import { useState } from 'react';

interface StepCompanyProps {
  onNext: (data: { email: string; taskId: string; questions: string[] }) => void;
}

export function StepCompany({ onNext }: StepCompanyProps) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          taskType: 'cancel_subscription',
          initialInput: company
        })
      });

      if (!response.ok) throw new Error('Failed to create task');

      const data = await response.json();
      onNext({
        email,
        taskId: data.taskId,
        questions: data.questions
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-2">
        What do you want to cancel?
      </h2>
      <p className="text-slate-400 mb-6">
        We'll call them and handle the cancellation for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Spectrum, Comcast, Planet Fitness"
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-slate-500">
            Just the company name is fine - we'll ask for details next
          </p>
        </div>

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