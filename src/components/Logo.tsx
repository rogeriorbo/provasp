import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  variant = 'full',
  size = 'md'
}) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${iconSizes[size]} flex items-center justify-center group`}
      >
        <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 opacity-20 group-hover:rotate-12 transition-transform duration-500" />
        <div className="absolute inset-0 bg-blue-600 rounded-2xl -rotate-3 opacity-10 group-hover:-rotate-6 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center z-10">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-1/2 h-1/2 text-white" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        
        {/* Abstract "A" shape background */}
        <div className="absolute -bottom-1 -right-1 w-1/2 h-1/2 bg-white/20 rounded-full blur-md" />
      </motion.div>

      {variant !== 'icon' && (
        <div className="flex flex-col justify-center">
          <h1 className={`${textSizes[size]} font-display font-black tracking-tighter uppercase leading-none select-none`}>
            Aprende<span className="text-blue-600 group-hover:text-blue-500 transition-colors">+</span>
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-blue-600 to-transparent mt-1 rounded-full" 
          />
        </div>
      )}
    </div>
  );
};
