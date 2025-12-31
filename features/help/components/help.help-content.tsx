'use client';

import type { HelpContent } from '../types/help.types';

interface HelpContentRendererProps {
  content: HelpContent;
}

export function HelpContentRenderer({ content }: HelpContentRendererProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">What is this for?</h4>
        <p className="text-sm text-gray-600">{content.whatIsThis}</p>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Current Status</h4>
        <p className="text-sm text-gray-600">{content.currentStatus}</p>
      </div>

      {content.formula && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Formula</h4>
          <div className="rounded-lg bg-gray-50 p-3">
            <code className="text-sm text-gray-800">{content.formula}</code>
          </div>
        </div>
      )}

      {content.examples && content.examples.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Examples</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            {content.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
