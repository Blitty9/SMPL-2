import logo from '../../assets/logo.svg';

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img 
        src={logo} 
        alt="SMPL Logo" 
        className="h-7 w-7 flex-shrink-0"
      />
      <span className="text-xl font-semibold tracking-tight">SMPL</span>
    </div>
  );
}
