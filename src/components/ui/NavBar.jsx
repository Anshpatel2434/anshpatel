"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, User, Briefcase, Code, Mail } from "lucide-react";
import { Link } from "react-scroll";

const navItems = [
  { name: "Home", icon: Home, href: "home" },
  { name: "About", icon: User, href: "about" },
  { name: "Skills", icon: Code, href: "skills" },
  { name: "Projects", icon: Briefcase, href: "projects" },
  { name: "Contact", icon: Mail, href: "contact" },
];

export function NavBar() {
  const [activeTab, setActiveTab] = useState("Home");

  const handleScroll = (section) => {
    setActiveTab(section);
  };

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center pt-4 px-4"
      >
        <div className="flex items-center gap-1 bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <Link
                key={item.name}
                to={item.href}
                smooth={true}
                offset={-80}
                duration={500}
                onClick={() => handleScroll(item.name)}
                className={`
                  relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive 
                    ? "text-white" 
                    : "text-gray-400 hover:text-white"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} strokeWidth={2.5} />
                  <span className="hidden lg:inline">{item.name}</span>
                </span>
                {isActive && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-t-full">
                      <div className="absolute w-10 h-4 bg-cyan-400/20 rounded-full blur-md -top-1 -left-2" />
                      <div className="absolute w-6 h-4 bg-cyan-400/20 rounded-full blur-md -top-0.5" />
                    </div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center pb-4 px-4"
      >
        <div className="flex items-center gap-1 bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <Link
                key={item.name}
                to={item.href}
                smooth={true}
                offset={-80}
                duration={500}
                onClick={() => handleScroll(item.name)}
                className={`
                  relative p-3 rounded-full transition-all duration-300
                  ${isActive 
                    ? "text-white" 
                    : "text-gray-400 hover:text-white"
                  }
                `}
              >
                <Icon size={20} strokeWidth={2.5} />
                {isActive && (
                  <motion.div
                    layoutId="lamp-mobile"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

export default NavBar;
