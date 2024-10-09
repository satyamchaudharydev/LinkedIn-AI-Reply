import React from "react";
import  { createRoot } from "react-dom/client";
import "~/assets/tailwind.css";
import Generate from "@/components/Generate";

export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  async main() {
    // Function to handle message container updates
    const handleMessageContainers = () => {
      const messageContainers = document.querySelectorAll('.msg-form__contenteditable');
      
      messageContainers.forEach(container => {
        const parent = container.parentElement;
        if (parent && !parent.querySelector('.generate-button-container')) {
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'generate-button-container sticky left-[calc(100%-36px)] bottom-3 w-fit';
          parent.style.position = 'relative';
          parent.appendChild(buttonContainer);
          
          const root = createRoot(buttonContainer);
          root.render(<Generate />);
        }
      });
    };

    // Initial handling
    handleMessageContainers();

    // Set up mutation observer to watch for changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
           console.log("calling handleMessageContainers");
          handleMessageContainers();
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      document.querySelectorAll('.generate-button-container').forEach(container => {
        container.remove();
      });
    };
  },
});