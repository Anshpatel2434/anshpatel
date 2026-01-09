import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MyPic } from "../data/imgs-imports";
import { Code, Award, Target } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Code, label: "Projects Completed", value: "15+" },
    { icon: Award, label: "Years Experience", value: "2+" },
    { icon: Target, label: "Client Satisfaction", value: "100%" },
  ];

  return (
    <section
      id="about"
      className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="order-2 lg:order-1">
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              About Me
            </motion.span>

            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">Passionate about </span>
              <span className="gradient-text">creating digital experiences</span>
            </motion.h2>

            <motion.p
              className="text-gray-400 text-lg leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              I&apos;m a <span className="text-cyan-400">Full Stack Web Developer</span> with a
              passion for building robust and scalable web applications. My expertise
              spans both <span className="text-purple-400">front-end and back-end
              development</span>, allowing me to create seamless, responsive, and
              efficient solutions.
            </motion.p>

            <motion.p
              className="text-gray-400 text-lg leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              I constantly explore new technologies and methodologies to stay at the
              forefront of web development. My approach combines technical excellence
              with creative problem-solving to deliver exceptional results.
            </motion.p>

            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-4 rounded-xl bg-navy-light/50 border border-white/5 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <stat.icon size={24} className="mx-auto mb-2 text-cyan-400" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-[2rem] blur-2xl opacity-30" />

              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2rem] overflow-hidden border-2 border-white/10">
                <LazyLoadImage
                  effect="blur"
                  threshold={70}
                  src={MyPic}
                  alt="Ansh Patel"
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>

              <div className="absolute -bottom-4 -right-4 p-4 rounded-xl bg-navy-light border border-white/10 shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Available for work</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
