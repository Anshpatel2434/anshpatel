import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../functions/utils";

export function GlowingCard({
  children,
  className,
  borderWidth = 1,
  glow = true,
  disabled = true,
  ...props
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative", className)}
      {...props}
    >
      <div
        className={cn(
          "absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500",
          glow && !disabled && "opacity-100"
        )}
        style={{
          background: `radial-gradient(800px circle at ${
            (mouseXSpring.get() + 0.5) * 100
          }% ${(mouseYSpring.get() + 0.5) * 100}%, rgba(6, 182, 212, 0.15), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

export function CardContainer({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "h-full w-full rounded-xl bg-navy-light/50 backdrop-blur-sm border border-white/5 p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlowingCard;
