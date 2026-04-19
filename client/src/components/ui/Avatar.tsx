interface AvatarProps {
  nom: string
  avatar?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }

const colors = [
  'bg-[#CECBF6] text-[#3C3489]',
  'bg-[#9FE1CB] text-[#085041]',
  'bg-[#FAC775] text-[#633806]',
  'bg-[#F5C4B3] text-[#712B13]',
]

export const Avatar = ({ nom, avatar, size = 'md' }: AvatarProps) => {
  const initials = nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const colorIdx = nom.charCodeAt(0) % colors.length

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={nom}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${sizes[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center font-medium flex-shrink-0`}>
      {initials}
    </div>
  )
}