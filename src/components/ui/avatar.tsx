import Image from 'next/image';

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-sm',
};

interface AvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
  columnColor?: string;
  className?: string;
}

export function Avatar({
  name,
  image,
  size = 'sm',
  columnColor = '#4A90E2',
}: AvatarProps) {
  const getInitials = (name: string | undefined) => {
    if (!name) return '';

    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

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
      title={name}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          className="rounded-full object-cover bg-white"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
