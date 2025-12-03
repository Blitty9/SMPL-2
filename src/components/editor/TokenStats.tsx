interface TokenStatsProps {
  originalTokens: number;
  jsonTokens: number;
  smplTokens: number;
  originalExact?: boolean;
  jsonExact?: boolean;
  smplExact?: boolean;
}

export default function TokenStats({ 
  originalTokens, 
  jsonTokens, 
  smplTokens,
  originalExact,
  jsonExact,
  smplExact,
}: TokenStatsProps) {
  const stats = [
    { label: 'Original Text', value: originalTokens, isExact: originalExact },
    { label: 'JSON Schema', value: jsonTokens, isExact: jsonExact },
    { label: 'SMPL Format', value: smplTokens, isExact: smplExact },
  ];

  return (
    <div className="p-4 lg:p-8 pt-0">
      <div className="space-y-2 sm:space-y-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111215] border border-[#2F333A] border-l-2 border-l-[#6D5AE0] rounded p-2 sm:p-3"
          >
            <div className="flex justify-between items-center gap-2">
              <span className="text-[#A0A0A0] text-xs font-mono truncate">{stat.label}</span>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <span className="text-[#ECECEC] text-xs sm:text-sm font-mono font-medium">
                  {stat.value.toLocaleString()}
                </span>
                {stat.isExact !== undefined && (
                  <span className={`text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded ${
                    stat.isExact 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {stat.isExact ? 'exact' : '~approx'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
