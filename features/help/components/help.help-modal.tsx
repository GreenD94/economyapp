'use client';

import { X } from 'lucide-react';
import type { HelpContent } from '../types/help.types';

interface HelpModalProps {
  content: HelpContent;
  onClose: () => void;
}

export function HelpModal({ content, onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{content.title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">What is this for?</h3>
            <p className="text-sm text-gray-600">{content.whatIsThis}</p>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Current Status</h3>
            <p className="text-sm text-gray-600">{content.currentStatus}</p>
          </div>

          {content.formula && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Formula</h3>
              <p className="rounded bg-gray-50 p-3 font-mono text-sm text-gray-800">
                {content.formula}
              </p>
            </div>
          )}

          {content.examples && content.examples.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Tips</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                {content.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors active:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
