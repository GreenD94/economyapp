'use client';

import { AlertTriangle, XCircle, AlertCircle } from 'lucide-react';

interface LimitAlertBannerProps {
  current: number;
  limit: number;
  thresholds: {
    warning: number;
    danger: number;
    critical: number;
  };
}

export function LimitAlertBanner({
  current,
  limit,
  thresholds,
}: LimitAlertBannerProps) {
  if (limit === 0) {
    return null;
  }

  const percentage = (current / limit) * 100;
  const isWarning = percentage >= thresholds.warning && percentage < thresholds.danger;
  const isDanger = percentage >= thresholds.danger && percentage < thresholds.critical;
  const isCritical = percentage >= thresholds.critical;

  if (!isWarning && !isDanger && !isCritical) {
    return null;
  }

  const getAlertConfig = () => {
    if (isCritical) {
      return {
        icon: XCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
        message: 'You have exceeded your monthly spending limit!',
      };
    }
    if (isDanger) {
      return {
        icon: AlertTriangle,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        iconColor: 'text-orange-600',
        message: 'You are approaching your monthly spending limit!',
      };
    }
    return {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      message: 'You are getting close to your monthly spending limit.',
    };
  };

  const config = getAlertConfig();
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${config.bgColor} ${config.borderColor}`}
    >
      <Icon className={`mt-0.5 ${config.iconColor}`} size={20} />
      <div className="flex-1">
        <p className={`font-medium ${config.textColor}`}>{config.message}</p>
        <p className={`mt-1 text-sm ${config.textColor} opacity-80`}>
          Current spending: {percentage.toFixed(1)}% of your limit
        </p>
      </div>
    </div>
  );
}
