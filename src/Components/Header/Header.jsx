import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion';

const ExpandableWord = ({ short, long }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      layout // Smoothly animates the width container dynamically
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        overflow: 'hidden',       // Clips text during transition
        whiteSpace: 'nowrap',     // Prevents text wrapping
        backgroundColor: '#f3f4f6', 
        padding: '2px 8px',
        borderRadius: '4px',
        color: '#1d4ed8',
        fontWeight: '600'
      }}
    >
      {/* The main short word (e.g., OTT) */}
      <motion.span layout="position">{short}</motion.span>

      {/* The expanded portion that fades & widens into view */}
      <motion.span
        layout
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isHovered ? "auto" : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{
          color: '#4b5563',
          fontWeight: '400',
          fontSize: '0.95em'
        }}
      >
        &nbsp;({long})
      </motion.span>
    </motion.span>
  );
};

function Header() {

  return (
    <>
    <header className='h-18 w-full bg-red-100 font-[Inter] font-bold flex items-center justify-center'>
    <div className='text-center text-4xl text-fuchsia-400 cursor-pointer flex gap-1.5'>
        <ExpandableWord short={'KNN'} long={'Khushi Neural Network'} />
        -
        <ExpandableWord short={'HDR'} long={'Handwritten Digit Recognizer'} />
    </div>
    </header>
    </>
  )
}

export default Header