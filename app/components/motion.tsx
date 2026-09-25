"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const revealVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
};

const staggerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09 } },
};

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    const reducedMotion = useReducedMotion();
    return <motion.div className={className} variants={revealVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function StaggerGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
    const reducedMotion = useReducedMotion();
    return <motion.div className={className} variants={staggerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} transition={{ duration: reducedMotion ? 0 : 0.4 }}>{children}</motion.div>;
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
    const reducedMotion = useReducedMotion();
    return <motion.div className={className} variants={revealVariants} transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function Float({ children, className = "" }: { children: ReactNode; className?: string }) {
    const reducedMotion = useReducedMotion();
    return <motion.div className={className} animate={reducedMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>{children}</motion.div>;
}
