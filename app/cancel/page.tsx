'use client';

import { useState } from 'react';
import { StepCompany } from '@/components/cancel/StepCompany';
import { StepQuestions } from '@/components/cancel/StepQuestions';
import { StepApproval } from '@/components/cancel/StepApproval';
import { StepComplete } from '@/components/cancel/StepComplete';

type Step = 'company' | 'questions' | 'approval' | 'complete';

export default function CancelPage() {
  const [step, setStep] = useState<Step>('company');
  const [taskId, setTaskId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [preview, setPreview] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm">
              <div className={step === 'company' ? 'text-blue-400 font-semibold' : 'text-slate-400'}>
                Company
              </div>
              <div className="flex-1 h-px bg-slate-700 mx-4" />
              <div className={step === 'questions' ? 'text-blue-400 font-semibold' : 'text-slate-400'}>
                Details
              </div>
              <div className="flex-1 h-px bg-slate-700 mx-4" />
              <div className={step === 'approval' ? 'text-blue-400 font-semibold' : 'text-slate-400'}>
                Approve
              </div>
              <div className="flex-1 h-px bg-slate-700 mx-4" />
              <div className={step === 'complete' ? 'text-blue-400 font-semibold' : 'text-slate-400'}>
                Done
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            {step === 'company' && (
              <StepCompany 
                onNext={(data) => {
                  setEmail(data.email);
                  setTaskId(data.taskId);
                  setQuestions(data.questions);
                  setStep('questions');
                }}
              />
            )}

            {step === 'questions' && (
              <StepQuestions 
                taskId={taskId}
                questions={questions}
                onNext={(data) => {
                  setPreview(data.preview);
                  setStep('approval');
                }}
              />
            )}

            {step === 'approval' && (
              <StepApproval 
                taskId={taskId}
                preview={preview}
                onNext={() => setStep('complete')}
              />
            )}

            {step === 'complete' && (
              <StepComplete email={email} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}