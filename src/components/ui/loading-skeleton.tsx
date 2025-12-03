import { CodeSkeleton, EditorSkeleton } from './skeleton';

interface LoadingStateProps {
  type?: 'editor' | 'code' | 'full';
  message?: string;
}

export function LoadingSkeleton({ type = 'code', message }: LoadingStateProps) {
  if (type === 'editor') {
    return <EditorSkeleton />;
  }

  if (type === 'full') {
    return (
      <div className="h-full flex flex-col">
        <div className="p-8 border-b border-[#2F333A]">
          <div className="h-6 w-32 bg-[#2F333A] rounded animate-pulse mb-2" />
          <div className="h-1 w-16 bg-[#2F333A] rounded animate-pulse" />
        </div>
        <div className="flex-1 p-8">
          <CodeSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {message && (
        <div className="p-4 border-b border-[#2F333A] bg-[#111215]">
          <p className="text-sm text-[#C7B8FF] flex items-center gap-2">
            <span className="w-2 h-2 bg-[#6D5AE0] rounded-full animate-pulse" />
            {message}
          </p>
        </div>
      )}
      <div className="flex-1 p-6">
        <CodeSkeleton />
      </div>
    </div>
  );
}

export function ProgressIndicator({ progress, message }: { progress?: number; message?: string }) {
  return (
    <div className="p-4 border-b border-[#2F333A] bg-[#111215]">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          {message && (
            <p className="text-sm text-[#ECECEC] mb-2">{message}</p>
          )}
          {progress !== undefined && (
            <div className="w-full bg-[#2F333A] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6D5AE0] to-[#C7B8FF] transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          )}
          {progress !== undefined && (
            <p className="text-xs text-graphite-gray mt-1">{Math.round(progress)}%</p>
          )}
        </div>
      </div>
    </div>
  );
}

