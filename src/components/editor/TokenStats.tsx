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
    <div className="p-8 pt-0">
      <div className="space-y-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111215] border border-[#2F333A] border-l-2 border-l-[#6D5AE0] rounded p-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-[#A0A0A0] text-xs font-mono">{stat.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[#ECECEC] text-sm font-mono font-medium">
                  {stat.value.toLocaleString()} tokens
                </span>
                {stat.isExact !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
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
