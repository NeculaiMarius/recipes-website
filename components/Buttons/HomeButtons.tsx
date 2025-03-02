"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
        <motion.div className=" button-style w-[300px] max-md:w-[260px] text-6xl my-4" whileTap={{ scale: 0.95 }} >
          {isMobile ? (
            
              <Image 
                height={70}
                width={70}
                src={image}
                alt='Icon'
              />
            
          ) : (
            <motion.span
              className="relative right-2"
              variants={emojiVariants}
              transition={{ duration: 0.3 }}
            >
              <Image 
                height={80}
                width={80}
                src={image}
                alt='Icon'
              />
            </motion.span>
          )}
          <span className='text-lg font-bold text-gray-700 max-md:text-base'>
            {text}
          </span>
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default HomeButtons;
