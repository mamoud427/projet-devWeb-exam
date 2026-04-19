type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-[#E1F5EE] text-[#0F6E56]',
  warning: 'bg-[#FAEEDA] text-[#854F0B]',
  danger: 'bg-[#FCEBEB] text-[#A32D2D]',
  info: 'bg-[#EEEDFE] text-[#3C3489]',
  default: 'bg-gray-100 text-gray-600',
}

export const Badge = ({ children, variant = 'default' }: BadgeProps) => (
  <span className={`text-xs font-medium px-2 py-1 rounded-full ${variants[variant]}`}>
    {children}
  </span>
)