"use client";
import React from "react";
import PlusIcon from "../assets/icons/plus.svg";
import MinusIcon from "../assets/icons/minus.svg";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  {
    question: "What do I need to get started?",
    answer: "Just your course syllabus and test dates!",
  },
  {
    question: "Can I edit the AI-generated roadmap?",
    answer: "Yes, you can customize every step.",
  },
  {
    question: "What types of files can I upload?",
    answer: "PDFs, DOCs, and text notes.",
  },
  {
    question: "Is this free to use?",
    answer: "Yes, during our beta phase it’s completely free.",
  },
  {
    question: "Can I use this for multiple classes?",
    answer: "Absolutely. Add as many classes as you'd like.",
  },
];

const AccordionItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      key={question}
      className="py-7 border-b border-white/30"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center cursor-pointer">
        <span className="flex-1 text-lg font-bold">{question}</span>
        {isOpen ? <MinusIcon /> : <PlusIcon />}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
          >
            <p className="text-white/70">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQs = () => {
  return (
    <div
      id="faqs"
      className="bg-black text-white bg-[linear-gradient(to_bottom,#FF9500_0%,#FF6B00_34%,#471A00_65%,#000000_100%)] py-[72px] sm:py-24"
    >
      <div className="container">
        <h2 className="text-center text-5xl sm:text-6xl sm:max-w-[648px] mx-auto font-bold tracking-tighter">
          Frequently Asked Questions
        </h2>
        <div className="mt-12 max-w-[648px] mx-auto">
          {items.map(({ question, answer }) => (
            <AccordionItem question={question} answer={answer} key={question} />
          ))}
        </div>
      </div>
    </div>
  );
};
