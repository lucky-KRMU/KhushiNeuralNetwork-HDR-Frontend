import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion';
import { MdOutlineStarPurple500 } from "react-icons/md";

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
        backgroundColor: '#F472B6', 
        padding: '2px 8px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: '650',
        fontFamily: 'Inter'
      }}
    >
      <motion.span layout="position">{short}</motion.span>

      
      <motion.span
        layout
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isHovered ? "auto" : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{
          color: '#5b21b6',
          fontWeight: '800',
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
    <header className='h-[10vh] md:h-[15vh] w-full bg-pink-600 font-[Inter] font-bold flex items-center justify-center'>
    <div className='text-center text-4xl text-violet-700 cursor-pointer flex gap-1.5 items-center justify-center'>
        <ExpandableWord short={'KNN'} long={'Khushi Neural Network'} />
        <MdOutlineStarPurple500 className='hover:text-5xl duration-200 text-fuchsia-400' />
        <ExpandableWord short={'HDR'} long={'Handwritten Digit Recognizer'} />
    </div>
    </header>
    </>
  )
}

export default Header