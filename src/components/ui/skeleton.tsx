import { cn } from '../../lib/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-[#2F333A] rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    rectangular: 'w-full',
    circular: 'rounded-full',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i < lines - 1 ? 'mb-2' : ''}
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}

export function CodeSkeleton() {
  return (
    <div className="space-y-2 p-4">
      <Skeleton height={16} width="60%" className="mb-4" />
      <Skeleton height={12} width="100%" />
      <Skeleton height={12} width="95%" />
      <Skeleton height={12} width="100%" />
      <Skeleton height={12} width="85%" />
      <Skeleton height={12} width="100%" />
      <Skeleton height={12} width="90%" />
      <Skeleton height={12} width="75%" />
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="h-full flex flex-col p-8">
      <div className="mb-6">
        <Skeleton height={24} width={200} className="mb-2" />
        <Skeleton height={2} width={64} />
      </div>
      <div className="flex-1 space-y-4 mb-6">
        <Skeleton height={40} width="100%" />
        <Skeleton height={40} width="100%" />
        <Skeleton height={120} width="100%" />
      </div>
      <Skeleton height={48} width="100%" />
    </div>
  );
}

