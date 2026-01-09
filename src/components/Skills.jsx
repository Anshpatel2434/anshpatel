"use client";

import { motion } from "react";
import OrbitingSkills from "./ui/OrbitingSkills";
import AllSkillsImages from "../data/skills-imgs";

const Skills = () => {
  const techStack = [
    "React", "Node.js", "TypeScript", "MongoDB",
    "Express", "Tailwind CSS", "Python", "Git"
  ];

  const otherSkills = AllSkillsImages.filter(skill => {
    const name = skill.imageAlt.toLowerCase();
    return !techStack.some(tech => name.includes(tech.toLowerCase()));
  });

  return (
    <section
      id="skills"
      className="relative w-full py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden"
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
            My Expertise
          </motion.span>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">Skills & </span>
            <span className="gradient-text">Technologies</span>
          </motion.h2>

          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            A collection of technologies and tools I use to bring ideas to life
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <OrbitingSkills />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-center text-white mb-8">
            Additional Technologies
          </h3>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {otherSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-4 rounded-xl bg-navy-light/50 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img
                      src={skill.imageSrc}
                      alt={skill.imageAlt}
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      draggable="false"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-navy-light border border-white/10 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {skill.imageAlt}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default Skills;
