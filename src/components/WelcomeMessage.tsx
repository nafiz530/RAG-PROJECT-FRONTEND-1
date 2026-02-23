// WelcomeMessage for New Vision: Animated greetings bubble with framer-motion fade-in.
// Modern UI with gradient background, shadow, and rounded corners.

import { motion } from 'framer-motion';

export default function WelcomeMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="max-w-md mx-auto p-6 rounded-xl shadow-md bg-gradient-to-br from-primary/10 to-secondary/10 border border-border"
    >
      <h3 className="text-lg font-semibold mb-2">Welcome to New Vision!</h3>
      <p className="text-muted-foreground">
        Select a subject and language, then ask away about your grade 10 textbooks. Let's manifest knowledge!
      </p>
    </motion.div>
  );
}