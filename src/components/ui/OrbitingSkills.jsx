import { useEffect, useState, memo } from "react";

const iconComponents = {
  html: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" fill="#E34F26"/>
      </svg>
    ),
    color: "#E34F26"
  },
  css: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.751L12 19.351l5.379-1.443.744-8.157z" fill="#1572B6"/>
      </svg>
    ),
    color: "#1572B6"
  },
  javascript: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <rect width="24" height="24" fill="#F7DF1E"/>
        <path d="M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" fill="#323330"/>
      </svg>
    ),
    color: "#F7DF1E"
  },
  typescript: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M3 3h18v18H3V3zm10.71 14.86c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8zm-5.09-3.15v1.36h2.16v6.08h1.65v-6.08h2.16v-1.36h-5.97z" fill="#3178C6"/>
      </svg>
    ),
    color: "#3178C6"
  },
  react: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <g stroke="#61DAFB" strokeWidth="1.5" fill="none">
          <circle cx="12" cy="12" r="2.5" fill="#61DAFB"/>
          <ellipse cx="12" cy="12" rx="10" ry="4"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
        </g>
      </svg>
    ),
    color: "#61DAFB"
  },
  node: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#339933"/>
      </svg>
    ),
    color: "#339933"
  },
  tailwind: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#06B6D4"/>
      </svg>
    ),
    color: "#06B6D4"
  },
  python: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.24.38-.22.46-.2.54-.19.64-.18.74-.19.85-.2.97-.24 1.09-.28 1.22-.34 1.35-.42 1.48-.52 1.61-.64 1.74-.78 1.85-.94 1.96-1.11 2.05-1.29 2.1-1.48 2.07-1.68.95-.19.81-.35.68-.5.55-.62.43-.7.31-.75.2-.75.1-.71.04-.64-.01-.56-.05-.47-.07-.37-.06-.28-.04-.19-.02-.1-.01 2.75v4.72l.02.34-.02.32-.05.3-.09.28-.14.26-.2.25-.27.23-.35.22-.43.2-.53.18-.63.16-.75.14-.87.12-1 .1-1.14.08-1.28.06-1.43.04-1.58.02-1.73-.01-1.88-.05-2-.18-.18-.02-.16-.05-.14-.09-.12-.14-.1-.2-.08-.26-.07-.33-.05-.41-.04-.5-.02-.59-.01-.69 0-.8.01-.91.03-1.04.06-1.17.1-1.31.15-1.46.21-1.62.28-1.8.36-1.96.47-2.12.61-2.26.77-2.38.96-2.46 1.18-2.5 1.4-.24.01-.21.04-.18.07-.15.1-.12.14-.1.18-.07.21-.04.24-.02.26 0 .21.03.18.06.15.1.12.14.1.18.07.22.05.26.02.29 0 .25-.03.22-.06.19-.1.16-.14.13-.18.11-.23.08-.28.06-.33.04-.39.02-.45 0-.52-.02-.59-.05-.67-.1-.75-.16-.83-.24-.9-.33-.96-.44-1-.56-1.05-.69-.98-.83-.9-.97-.8-1.08-.67-1.18-.51-1.24-.33-1.25-.14-.15 0-.12.03-.1.07-.08.1-.06.15-.04.2-.02.24 0 .25.03.23.06.2.1.17.14.14.2.11.25.09.31.06.38.04.45.02.53 0 .62-.02.71-.05.81-.1.91-.16 1.02-.24 1.12-.34 1.23-.46 1.32-.6 1.4-.76 1.44-.93 1.45-1.11.12-.02.23-.05.33-.1.12-.06.23-.14.33-.24.1-.1.2-.22.28-.36.08-.14.16-.3.21-.48.05-.18.1-.38.12-.6.02-.22.04-.46.02-.71 0-.25-.03-.52-.1-.8-.06-.28-.15-.58-.27-.88-.12-.3-.27-.61-.45-.92-.18-.31-.4-.62-.65-.92-.24-.3-.52-.59-.84-.86-.32-.27-.66-.52-1.03-.75-.36-.22-.75-.42-1.16-.58-.41-.16-.85-.29-1.32-.38-.47-.09-.96-.14-1.47-.15-.51 0-1.03.05-1.55.16-.52.11-1.04.28-1.56.5-.52.22-1.03.5-1.53.82-.51.32-1 .7-1.46 1.13C5.32 7.8 4.94 8.3 4.6 8.86c-.34.56-.63 1.17-.85 1.82-.22.65-.39 1.34-.48 2.06-.1.72-.14 1.47-.12 2.24.02.77.12 1.55.29 2.32.17.77.42 1.51.74 2.22.32.71.71 1.36 1.18 1.92.47.56 1.02 1.03 1.63 1.39.61.36 1.28.62 1.99.76.71.14 1.46.18 2.21.1.75-.07 1.47-.25 2.15-.51.68-.26 1.32-.62 1.9-1.05.58-.42 1.1-.93 1.53-1.5.43-.57.78-1.2 1.04-1.88.26-.68.41-1.42.41-2.18 0-.76-.15-1.5-.45-2.18-.3-.68-.73-1.28-1.26-1.77-.54-.49-1.16-.86-1.85-1.1-.69-.24-1.44-.33-2.17-.25-.73.08-1.41.32-2.02.7-.61.39-1.13.91-1.54 1.53-.41.62-.72 1.31-.92 2.05-.2.74-.27 1.52-.2 2.29.07.77.3 1.48.66 2.1.36.62.86 1.12 1.45 1.48.59.36 1.27.57 2 .61.73.05 1.46-.12 2.12-.47.66-.35 1.22-.88 1.65-1.52.43-.64.73-1.37.88-2.14.15-.77.12-1.58-.1-2.35-.21-.78-.59-1.46-1.1-2.01z" fill="#3776AB"/>
      </svg>
    ),
    color: "#3776AB"
  },
  git: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="#F05032"/>
      </svg>
    ),
    color: "#F05032"
  },
  mongodb: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" fill="#47A248"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="#47A248"/>
        <path d="M12 4.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 13c-4.4 0-8-1.8-8-4v2c0 2.2 3.6 4 8 4s8-1.8 8-4v-2c0 2.2-3.6 4-8 4z" fill="#47A248"/>
        <path d="M12 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#47A248"/>
      </svg>
    ),
    color: "#47A248"
  },
};

const SkillIcon = memo(({ type }) => {
  const IconComponent = iconComponents[type]?.component;
  return IconComponent ? <IconComponent /> : null;
});
SkillIcon.displayName = "SkillIcon";

const skillsConfig = [
  { id: "html", orbitRadius: 90, size: 36, speed: 0.8, iconType: "html", phaseShift: 0, glowColor: "cyan", label: "HTML5" },
  { id: "css", orbitRadius: 90, size: 36, speed: 0.8, iconType: "css", phaseShift: Math.PI / 1.5, glowColor: "cyan", label: "CSS3" },
  { id: "js", orbitRadius: 90, size: 36, speed: 0.8, iconType: "javascript", phaseShift: Math.PI * 2 / 1.5, glowColor: "cyan", label: "JavaScript" },
  { id: "ts", orbitRadius: 90, size: 36, speed: 0.8, iconType: "typescript", phaseShift: Math.PI * 3, glowColor: "cyan", label: "TypeScript" },
  { id: "react", orbitRadius: 150, size: 42, speed: -0.5, iconType: "react", phaseShift: 0, glowColor: "purple", label: "React" },
  { id: "node", orbitRadius: 150, size: 42, speed: -0.5, iconType: "node", phaseShift: Math.PI * 1.2, glowColor: "purple", label: "Node.js" },
  { id: "tailwind", orbitRadius: 150, size: 36, speed: -0.5, iconType: "tailwind", phaseShift: Math.PI * 2.4, glowColor: "purple", label: "Tailwind" },
  { id: "python", orbitRadius: 150, size: 36, speed: -0.5, iconType: "python", phaseShift: Math.PI * 3.6, glowColor: "purple", label: "Python" },
  { id: "git", orbitRadius: 210, size: 32, speed: -0.3, iconType: "git", phaseShift: Math.PI * 0.5, glowColor: "cyan", label: "Git" },
  { id: "mongodb", orbitRadius: 210, size: 32, speed: -0.3, iconType: "mongodb", phaseShift: Math.PI * 1.5, glowColor: "cyan", label: "MongoDB" },
];

const OrbitingSkill = memo(({ config, angle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, iconType, label, glowColor } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  const colors = {
    cyan: { primary: "rgba(6, 182, 212, 0.6)", glow: "rgba(6, 182, 212, 0.3)" },
    purple: { primary: "rgba(139, 92, 246, 0.6)", glow: "rgba(139, 92, 246, 0.3)" }
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative w-full h-full bg-navy-light/90 backdrop-blur-sm
          rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer border
          ${isHovered ? "scale-125 shadow-2xl" : "shadow-lg hover:shadow-xl"}
        `}
        style={{
          borderColor: colors[glowColor]?.primary,
          boxShadow: isHovered
            ? `0 0 30px ${colors[glowColor]?.primary}, 0 0 60px ${colors[glowColor]?.glow}`
            : undefined
        }}
      >
        <SkillIcon type={iconType} />
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-navy-dark/95 backdrop-blur-sm rounded-lg text-xs text-white whitespace-nowrap border border-white/10">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = "OrbitingSkill";

const GlowingOrbitPath = memo(({ radius, glowColor = "cyan", animationDelay = 0 }) => {
  const colors = {
    cyan: { primary: "rgba(6, 182, 212, 0.15)", secondary: "rgba(6, 182, 212, 0.05)", border: "rgba(6, 182, 212, 0.2)" },
    purple: { primary: "rgba(139, 92, 246, 0.15)", secondary: "rgba(139, 92, 246, 0.05)", border: "rgba(139, 92, 246, 0.2)" }
  };

  const c = colors[glowColor] || colors.cyan;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
      }}
    >
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, transparent 40%, ${c.secondary} 70%, ${c.primary} 100%)`,
          boxShadow: `0 0 40px ${c.primary}, inset 0 0 40px ${c.secondary}`,
          animationDelay: `${animationDelay}s`,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${c.border}`,
        }}
      />
    </div>
  );
});
GlowingOrbitPath.displayName = "GlowingOrbitPath";

export default function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let animationFrameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime(prevTime => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const orbitConfigs = [
    { radius: 90, glowColor: "cyan", delay: 0 },
    { radius: 150, glowColor: "purple", delay: 1 },
    { radius: 210, glowColor: "cyan", delay: 2 }
  ];

  return (
    <div 
      className="relative w-full flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #374151 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, #4B5563 0%, transparent 50%)`,
          }}
        />
      </div>

      <div 
        className="relative w-[min(90vw,500px)] h-[min(90vw,500px)] md:w-[500px] md:h-[500px] flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />

        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center z-10 relative shadow-2xl">
          <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-xl animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
        </div>

        {orbitConfigs.map((config) => (
          <GlowingOrbitPath
            key={`path-${config.radius}`}
            radius={config.radius}
            glowColor={config.glowColor}
            animationDelay={config.delay}
          />
        ))}

        {skillsConfig.map((config) => {
          const angle = time * config.speed + (config.phaseShift || 0);
          return (
            <OrbitingSkill
              key={config.id}
              config={config}
              angle={angle}
            />
          );
        })}
      </div>
    </div>
  );
}
