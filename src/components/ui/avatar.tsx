import Image from 'next/image';

interface AvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
  columnColor?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function Avatar({
  name,
  image,
  size = 'sm',
  columnColor = '#4A90E2',
}: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, name.includes(' ') ? 2 : 1);

  const style = !image
    ? {
        backgroundColor: `${columnColor}20`,
        color: '#111827',
      }
    : {};

  return (
    <div
      className={`
        rounded-full flex items-center justify-center
        text-gray-900 font-medium
        ${sizeClasses[size]}
      `}
      style={style}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          className="rounded-full object-cover bg-white"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
