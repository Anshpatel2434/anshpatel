"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Code, Briefcase, Rocket, CheckCircle, Clock, Circle } from "lucide-react";

const iconMap = {
  Code,
  Briefcase,
  Rocket,
};

const TimelineCard = memo(({ item, isExpanded, onToggle, position }) => {
  const Icon = iconMap[item.icon] || Code;

  const statusStyles = {
    completed: { bg: "bg-cyan-500/20", border: "border-cyan-500/50", text: "text-cyan-400", icon: <CheckCircle size={14} /> },
    "in-progress": { bg: "bg-purple-500/20", border: "border-purple-500/50", text: "text-purple-400", icon: <Clock size={14} /> },
    pending: { bg: "bg-gray-500/20", border: "border-gray-500/50", text: "text-gray-400", icon: <Circle size={14} /> },
  };

  const style = statusStyles[item.status] || statusStyles.pending;

  return (
    <div
      className="absolute transition-all duration-500 cursor-pointer"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: isExpanded ? 50 : 10,
        opacity: isExpanded ? 1 : 0.9,
      }}
      onClick={() => onToggle(item.id)}
    >
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          bg-navy-light border-2 transition-all duration-300
          ${isExpanded 
            ? "border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)] scale-110" 
            : "border-white/20 hover:border-white/40"
          }
        `}
      >
        <Icon size={18} className={isExpanded ? "text-cyan-400" : "text-white/70"} />
      </div>

      {isExpanded && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-72 bg-navy-light/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.border} ${style.text} border flex items-center gap-1`}>
                {style.icon}
                {item.status.replace("-", " ").toUpperCase()}
              </span>
              <span className="text-xs text-gray-400 font-mono">{item.date}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-gray-300">{item.content}</p>
            
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Energy</span>
                <span className="font-mono text-cyan-400">{item.energy}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.energy}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

TimelineCard.displayName = "TimelineCard";

function RadialOrbitalTimeline({ timelineData }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef(null);
  const orbitRadius = 160;

  useEffect(() => {
    let rotationTimer;

    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.15) % 360;
          return Number(newAngle.toFixed(2));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) clearInterval(rotationTimer);
    };
  }, [autoRotate]);

  const toggleItem = (id) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];
      setAutoRotate(!newState[id]);
      
      return newState;
    });
  };

  const calculateNodePosition = (index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) * (Math.PI / 180);
    const x = orbitRadius * Math.cos(angle);
    const y = orbitRadius * Math.sin(angle);

    const zIndex = Math.round(100 + 50 * Math.cos(angle));
    const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(angle)) / 2)));

    return { x, y, zIndex, opacity };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-[min(90vw,400px)] h-[min(90vw,400px)] md:w-[400px] md:h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center z-10 relative">
            <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse" />
            <div className="absolute inset-2 rounded-full border border-white/5" />
            <Code size={32} className="text-white/80" />
          </div>
        </div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r={orbitRadius}
            fill="none"
            stroke="rgba(6, 182, 212, 0.1)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="200"
            r={orbitRadius}
            fill="none"
            stroke="rgba(6, 182, 212, 0.2)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            className="animate-spin-slow"
            style={{ transformOrigin: "center", animationDuration: "30s" }}
          />
        </svg>

        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];

          return (
            <TimelineCard
              key={item.id}
              item={item}
              isExpanded={isExpanded}
              onToggle={toggleItem}
              position={position}
            />
          );
        })}
      </div>
    </div>
  );
}

export default RadialOrbitalTimeline;
