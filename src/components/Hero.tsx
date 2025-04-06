"use client";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="bg-black text-white bg-[linear-gradient(to_bottom,#000000,#471A00_24%,#FF6B00_65%,#FF9500_82%)] py-[72px] sm:py-24 relative overflow-clip">
      <div className="container relative">
        <div className="flex justify-center mt-8">
          <motion.div
            className="inline-flex relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-7xl sm:text-9xl font-bold tracking-tighter text-center mt-8 inline-flex">
              Study Smarter,
              <br /> Not Harder.
            </h1>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-center text-xl mt-8 max-w-xl">
            Instantly turn your course work into a personalized study guide with
            dynamic roadmaps and smart quizzes.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <button className="bg-white text-black py-3 px-5 rounded-lg font-medium">
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};
