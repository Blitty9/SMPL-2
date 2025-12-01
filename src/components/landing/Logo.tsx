export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-8 h-8">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="4" y="4" width="10" height="10" fill="#C7B8FF" />
          <rect x="18" y="4" width="10" height="10" fill="#D4C5FF" />
          <rect x="4" y="18" width="10" height="10" fill="#D4C5FF" />
          <rect x="18" y="18" width="10" height="10" fill="#E5DEFF" />
        </svg>
      </div>
      <span className="text-xl font-semibold tracking-tight">SMPL</span>
    </div>
  );
}
