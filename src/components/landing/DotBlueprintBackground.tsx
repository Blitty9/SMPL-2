export default function DotBlueprintBackground() {


  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {/* Static Background */}
      <div className="absolute inset-0 w-full h-full opacity-[0.08]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Subtle Vignette */}
      <div className="absolute inset-0 w-full h-full bg-gradient-radial from-transparent via-transparent to-deep-black/20" />
    </div>
  );
}
