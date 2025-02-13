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

export function Avatar({ name, image, size = 'sm', columnColor = '#4A90E2' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const style = !image ? {
    backgroundColor: `${columnColor}40`,
    color: columnColor,
  } : {};

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-medium ring-2 ring-white`}
      style={style}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
} 