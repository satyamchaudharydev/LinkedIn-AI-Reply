import React, { useState, useEffect } from "react";
import Icon from "~/assets/Icon.svg";
import { motion, AnimatePresence } from "framer-motion";
import "~/assets/tailwind.css";
import { Modal } from "./Modal";
import { AIAssistant } from "./Interface";

const Generate: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    const container = document.querySelector('.msg-form__contenteditable');
    if (!container) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    container.addEventListener('focus', handleFocus);
    container.addEventListener('blur', handleBlur);

    return () => {
      container.removeEventListener('focus', handleFocus);
      container.removeEventListener('blur', handleBlur);
    };
  }, []);
  
  const handleInsert = (text: string) => {
    const container = document.querySelector('.msg-form__contenteditable') as HTMLDivElement;
    if (!container) return;
    
    const placeholderDiv = document.querySelector('.msg-form__placeholder');
    const paragraphElement = container.querySelector('p');
    
    setIsModalOpen(false);
    
    if (paragraphElement) {
      paragraphElement.textContent = text;
      
      if (placeholderDiv) {
        placeholderDiv.classList.remove("msg-form__placeholder");
      }
      
      container.focus();
      
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(paragraphElement);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      const inputEvent = new Event('input', { bubbles: true });
      container.dispatchEvent(inputEvent);
    }
  };

  return (
    <>
      <AnimatePresence>
        {true && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: "0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            className="right-2 bottom-2 bg-white p-2 
            flex justify-center items-center
            rounded-full shadow-md w-[32px] h-[32px] z-10"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={Icon} alt="icon" />
            <span className="sr-only">Generate message</span>
          </motion.button>
        )}
      </AnimatePresence>
      
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        document.querySelector('.msg-form__contenteditable');
      }} title="AI Assistant">
        <AIAssistant onInsert={handleInsert} />
      </Modal>
    </>
  );
};

export default Generate;