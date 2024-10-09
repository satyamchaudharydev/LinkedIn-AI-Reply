import React, { useState, useEffect, useCallback } from "react";
import Icon from "~/assets/Icon.svg";
import { motion, AnimatePresence } from "framer-motion";
import "~/assets/tailwind.css";
import { Modal } from "./Modal";
import { AIAssistant } from "./Interface";

type ContainerElement = HTMLDivElement | null;

const GenerateButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const getContainer = useCallback((): ContainerElement => {
    return document.querySelector<HTMLDivElement>(".msg-form__contenteditable");
  }, []);

  useEffect(() => {
    const container = getContainer();
    if (!container) return;

    const handleFocus = (): void => setIsFocused(true);
    const handleBlur = (): void => setIsFocused(false);

    container.addEventListener("focus", handleFocus);
    container.addEventListener("blur", handleBlur);

    return () => {
      container.removeEventListener("focus", handleFocus);
      container.removeEventListener("blur", handleBlur);
    };
  }, [getContainer]);

  const handleInsert = (text: string): void => {
    const container = getContainer();
    if (!container) return;

    const placeholderDiv = container.querySelector<HTMLDivElement>(".msg-form__placeholder");
    
    // Remove all existing paragraph elements
    container.querySelectorAll("p").forEach(p => p.remove());

    // Create a new paragraph element
    const newParagraph = document.createElement("p");
    newParagraph.textContent = text;
    container.appendChild(newParagraph);

    setIsModalOpen(false);

    if (placeholderDiv) {
      placeholderDiv.classList.remove("msg-form__placeholder");
    }

    container.focus();

    // Set cursor to the end of the new paragraph
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(newParagraph);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Trigger an input event to notify of content change
    const inputEvent = new Event("input", { bubbles: true });
    container.dispatchEvent(inputEvent);
  };

  return (
    <>
      <AnimatePresence>
        {isFocused && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            transition={{ duration: 0.2 }}
            style={{
              boxShadow:
                "0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            className="right-2 bottom-2 bg-white p-2 flex justify-center items-center rounded-full shadow-md w-[32px] h-[32px] z-10"
            onClick={() => setIsModalOpen(true)}
          >
            <img src={Icon} alt="icon" />
            <span className="sr-only">Generate message</span>
          </motion.button>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          getContainer()?.focus();
        }}
        title="AI Assistant"
      >
        <AIAssistant onInsert={handleInsert} />
      </Modal>
    </>
  );
};

export default GenerateButton;