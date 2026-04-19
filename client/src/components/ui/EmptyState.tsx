interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && (
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        {icon}
      </div>
    )}
    <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    {action}
  </div>
)