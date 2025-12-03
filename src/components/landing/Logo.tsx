import logo from '../../assets/logo.svg';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <img 
        src={logo} 
        alt="SMPL Logo" 
        className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0"
      />
      <span className="text-lg sm:text-xl font-semibold tracking-tight">SMPL</span>
    </div>
  );
}
