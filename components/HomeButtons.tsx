"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HomeButtons = ({ image, text, route }: { image: string; text: string; route: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    handleResize(); 
    window.addEventListener('resize', handleResize); // Ascultă modificările dimensiunii ferestrei

    return () => {
      window.removeEventListener('resize', handleResize); // Curăță evenimentul la demontare
    };
  }, []);

  const emojiVariants = {
    initial: { scale: 0.5 },
    hover: { scale: 1 }
  };

  return (
    <Link href={route}>
      <motion.div
        whileHover={!isMobile ? "hover" : undefined}
        initial="initial"
        className=""
      >
        <motion.div className=" button-style w-[320px] text-7xl" whileTap={{ scale: 0.95 }} >
          {isMobile ? (
            <span className="mr-4">{image}</span>
          ) : (
            <motion.span
              className="relative right-2"
              variants={emojiVariants}
              transition={{ duration: 0.3 }}
            >
              {image}
            </motion.span>
          )}
          <span className='text-lg font-bold text-gray-700'>
            {text}
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default HomeButtons;
