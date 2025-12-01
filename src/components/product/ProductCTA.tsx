import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface ProductCTAProps {
  onGetStarted?: () => void;
}

export function ProductCTA({ onGetStarted }: ProductCTAProps) {
  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,179,255,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C8B3FF]/30 bg-[#C8B3FF]/5 mb-6">
            <Sparkles className="w-4 h-4 text-[#C8B3FF]" />
            <span className="text-sm text-[#C8B3FF] font-medium">Ready to get started?</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
            Transform Your Workflow
            <br />
            <span className="text-[#C8B3FF]">with SMPL Today</span>
          </h2>

          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Start building better apps faster. Join developers who are already using SMPL to streamline their AI-assisted development workflow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              size="lg"
              className="group text-base"
              onClick={onGetStarted}
            >
              Launch Editor
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              View Documentation
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#2F333A]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8B3FF] mb-2">60-80%</div>
              <div className="text-sm text-neutral-400">Token Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8B3FF] mb-2">5+</div>
              <div className="text-sm text-neutral-400">Output Formats</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8B3FF] mb-2">100%</div>
              <div className="text-sm text-neutral-400">Open Source</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
