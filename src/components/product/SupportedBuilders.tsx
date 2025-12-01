import { motion } from "framer-motion";

export function SupportedBuilders() {
  const builders = [
    { name: "Cursor", gradient: "from-blue-500 to-cyan-500" },
    { name: "Claude", gradient: "from-amber-500 to-yellow-500" },
    { name: "Bolt", gradient: "from-yellow-500 to-orange-500" },
    { name: "v0.dev", gradient: "from-purple-500 to-pink-500" },
    { name: "Replit", gradient: "from-orange-500 to-red-500" },
    { name: "OpenAI", gradient: "from-green-500 to-emerald-500" },
    { name: "Anthropic", gradient: "from-amber-500 to-orange-500" },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            Works with Your <span className="text-[#C8B3FF]">Favorite Tools</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Generate optimized prompts for leading AI builders and code assistants
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6 max-w-6xl mx-auto">
          {builders.map((builder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative"
            >
              <div className="relative aspect-square rounded-lg border border-[#2F333A] bg-[#1A1D21] flex items-center justify-center overflow-hidden hover:border-[#C8B3FF]/50 transition-all duration-300">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${builder.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative z-10 text-center p-4">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${builder.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <span className="text-sm font-semibold text-white">{builder.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-neutral-500">
            Plus support for custom AI agents and automation workflows
          </p>
        </div>
      </div>
    </section>
  );
}
