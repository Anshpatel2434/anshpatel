import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/Anshpatel2434", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/anshpatel2434", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/AnshPatel2434", label: "Twitter" },
    { icon: Mail, href: "mailto:anshpatel24.work@gmail.com", label: "Email" },
  ];

  return (
    <footer className="relative w-full py-12 border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h3 className="text-lg font-bold text-white mb-2">
              Ansh<span className="gradient-text">.dev</span>
            </h3>
            <p className="text-gray-500 text-sm">
              Full Stack Web Developer crafting digital experiences
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 text-gray-500 text-sm"
          >
            <span>Made with</span>
            <Heart size={14} className="text-cyan-400 animate-pulse" />
            <span>by Ansh</span>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 pt-8 border-t border-white/5 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-600 text-sm">
            © {currentYear} Ansh Patel. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
