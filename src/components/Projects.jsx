"use client";

import { useState } from "react";
import { motion } from "react";
import AllProjectsImages from "../data/projects-imgs";
import { Github, ExternalLink } from "lucide-react";

const Projects = () => {
  const [visibleProjects, setVisibleProjects] = useState(3);

  const loadMoreProjects = () => {
    setVisibleProjects((prevCount) => prevCount + 3);
  };

  return (
    <section
      id="projects"
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-mono mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Portfolio
          </motion.span>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-white">Featured </span>
            <span className="gradient-text">Projects</span>
          </motion.h2>

          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            A selection of projects that showcase my skills and passion for development
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AllProjectsImages.slice(0, visibleProjects).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full rounded-2xl overflow-hidden bg-navy-light/50 border border-white/5 hover:border-cyan-500/30 transition-all duration-500">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    draggable="false"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/50 to-transparent opacity-60" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform translate-y-4 transition-transform duration-500">
                    <p className="text-cyan-400 text-sm font-mono mb-2">
                      {project.projectCategory}
                    </p>

                    <h3 className="text-xl font-bold text-white mb-3">
                      {project.imageAlt}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {project.projectDescription}
                    </p>

                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300"
                      >
                        <Github size={16} />
                        <span className="text-sm">Code</span>
                      </a>

                      {project.deploymentLink !== "/" && (
                        <a
                          href={project.deploymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300"
                        >
                          <ExternalLink size={16} />
                          <span className="text-sm">Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleProjects < AllProjectsImages.length && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={loadMoreProjects}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all duration-300"
            >
              Load More Projects
            </button>
          </motion.div>
        )}
      </div>

      <div className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default Projects;
