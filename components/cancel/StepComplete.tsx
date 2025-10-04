interface StepCompleteProps {
  email: string;
}

export function StepComplete({ email }: StepCompleteProps) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-2">
        Call in progress!
      </h2>
      <p className="text-slate-400 mb-6">
        Our AI is calling now. This usually takes 5-10 minutes.
      </p>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
        <p className="text-slate-300 mb-4">
          We'll send updates to:
        </p>
        <p className="text-blue-400 font-semibold">{email}</p>
      </div>

      <div className="text-sm text-slate-500">
        You can close this page. We'll email you when it's done.
      </div>
    </div>
  );
}