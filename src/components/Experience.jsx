import { motion } from "framer-motion";
import RadialOrbitalTimeline from "./ui/RadialOrbitalTimeline";
import AllExperienceInfo from "../data/experience-info";
import { Code } from "lucide-react";

const Experience = () => {
  const timelineData = AllExperienceInfo.map((exp, index) => ({
    id: exp.id,
    title: exp.role,
    date: exp.duration,
    content: exp.description.replace(/->\s*/g, '• ').split('\n').filter(Boolean).join('\n'),
    category: "Work",
    icon: Code,
    relatedIds: [],
    status: "completed",
    energy: 100 - index * 15,
  }));

  return (
    <section
      id="experience"
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Journey
          </motion.span>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">Work </span>
            <span className="gradient-text">Experience</span>
          </motion.h2>

          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            A timeline of my professional journey and accomplishments
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <RadialOrbitalTimeline timelineData={timelineData} />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {AllExperienceInfo.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="mb-8 last:mb-0"
            >
              <div className="p-6 rounded-xl bg-navy-light/50 border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-cyan-400">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500 font-mono mt-2 md:mt-0">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-gray-400 whitespace-pre-line text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/2 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default Experience;
