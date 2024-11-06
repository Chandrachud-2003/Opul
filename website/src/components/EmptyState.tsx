import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <ShoppingBag className="w-12 h-12 text-gray-400" />,
  title,
  description,
  action
}) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-xl">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}; 