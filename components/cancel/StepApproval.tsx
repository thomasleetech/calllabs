'use client';

import { useState } from 'react';

interface StepApprovalProps {
  taskId: string;
  preview: string;
  onNext: () => void;
}

export function StepApproval({ taskId, preview, onNext }: StepApprovalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks/${taskId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: 'pm_card_visa'
        })
      });

      if (!response.ok) throw new Error('Payment failed');

      onNext();
    } catch (err) {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-2">
        Review your call
      </h2>
      <p className="text-slate-400 mb-6">
        Here's what our AI will do:
      </p>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
        <p className="text-slate-300 whitespace-pre-line">{preview}</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Cost</span>
          <span className="text-2xl font-bold text-white">$12</span>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-4">{error}</div>
      )}

      <button
        onClick={handleApprove}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        {loading ? 'Processing Payment...' : 'Approve & Pay $12'}
      </button>
    </div>
  );
}