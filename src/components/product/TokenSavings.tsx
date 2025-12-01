import { motion } from "framer-motion";
import { TrendingDown, Zap, DollarSign } from "lucide-react";

export function TokenSavings() {
  const comparisons = [
    {
      format: "Verbose JSON",
      tokens: 2845,
      cost: "$0.0854",
      color: "text-red-400",
    },
    {
      format: "Standard JSON",
      tokens: 1623,
      cost: "$0.0487",
      color: "text-orange-400",
    },
    {
      format: "SMPL DSL",
      tokens: 487,
      cost: "$0.0146",
      color: "text-[#C8B3FF]",
      savings: "82.9%",
    },
  ];

  const benefits = [
    {
      icon: TrendingDown,
      title: "Lower Costs",
      value: "Save 60-80%",
      description: "Reduce API costs with compressed formats",
    },
    {
      icon: Zap,
      title: "Faster Processing",
      value: "3-5x Speed",
      description: "Less tokens means faster AI responses",
    },
    {
      icon: DollarSign,
      title: "Budget Friendly",
      value: "$100s Saved",
      description: "For projects with frequent iterations",
    },
  ];

  return (
    <section className="py-20 bg-deep-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(200,179,255,0.05),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            Massive <span className="text-[#C8B3FF]">Token Savings</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Real example: Medium-sized app specification across different formats
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-[#1A1D21]/50 rounded-lg border border-[#2F333A] p-8">
            <div className="space-y-6">
              {comparisons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-white font-semibold">{item.format}</span>
                      {item.savings && (
                        <span className="px-2 py-1 rounded-full bg-[#C8B3FF]/20 text-[#C8B3FF] text-xs font-semibold">
                          {item.savings} savings
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${item.color}`}>
                        {item.tokens.toLocaleString()} tokens
                      </div>
                      <div className="text-sm text-neutral-500">{item.cost}</div>
                    </div>
                  </div>
                  <div className="h-3 bg-[#0A0A0A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.tokens / 2845) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${
                        item.savings ? "bg-[#C8B3FF]" : "bg-neutral-700"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center p-6 rounded-lg border border-[#2F333A] bg-[#1A1D21]/30"
              >
                <div className="w-12 h-12 mx-auto rounded-lg bg-[#C8B3FF]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#C8B3FF]" />
                </div>
                <h3 className="text-lg font-semibold mb-1 text-white">{benefit.title}</h3>
                <div className="text-2xl font-bold text-[#C8B3FF] mb-2">{benefit.value}</div>
                <p className="text-sm text-neutral-400">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-500">
            * Based on GPT-4 pricing ($0.03 per 1K tokens). Actual savings vary by model and usage.
          </p>
        </div>
      </div>
    </section>
  );
}
