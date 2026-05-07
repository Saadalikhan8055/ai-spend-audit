'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface LeadCaptureFormProps {
  auditId: string;
  savings: number;
  onClose: () => void;
}

interface FormData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
}

export function LeadCaptureForm({ auditId, savings, onClose }: LeadCaptureFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          auditId,
          savings,
        }),
      });

      if (!response.ok) throw new Error('Failed to capture lead');

      setSubmitted(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error('Lead capture error:', error);
      alert('Failed to save. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-900">✓ Saved successfully!</p>
        <p className="mt-2 text-gray-700">Check your email for audit confirmation.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Get Your Full Report</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address *</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="you@company.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              {...register('companyName')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              {...register('role')}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., CTO, Engineering Lead"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Team Size</label>
          <input
            type="number"
            {...register('teamSize', { min: 1 })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Number of people"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}
