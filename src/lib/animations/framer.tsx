import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionWrapperProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
}

export function MotionDiv({ children, ...props }: MotionWrapperProps) {
  return <motion.div {...props}>{children}</motion.div>;
}

export function MotionSection({ children, ...props }: MotionWrapperProps) {
  return <motion.section {...props}>{children}</motion.section>;
}

export { motion };
