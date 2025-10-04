import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            CallLabs
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your AI calls for you. Cancel subscriptions, make reservations, 
            handle customer service—without waiting on hold.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">
              What do you need done?
            </h2>
            
            <div className="space-y-3">
              <Link 
                href="/cancel"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition text-center"
              >
                Cancel a Subscription
              </Link>
              
              <button 
                disabled
                className="block w-full bg-slate-700 text-slate-400 font-semibold py-4 px-6 rounded-xl cursor-not-allowed"
              >
                Make a Reservation (Coming Soon)
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              How it works
            </h3>
            <div className="space-y-3 text-slate-300">
              <div>1. Tell us what you need done</div>
              <div>2. We gather the details</div>
              <div>3. You approve the call</div>
              <div>4. Our AI handles it and texts you the result</div>
            </div>
            <div className="mt-6 text-sm text-slate-400">
              $12 per call • Usually takes 5-10 minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}