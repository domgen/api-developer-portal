/**
 * Popup Overlay - Standalone JavaScript popup component
 * Usage: <script src="popup-overlay.js"></script>
 */

(function() {
  'use strict';

  class PopupOverlay {
    constructor() {
      this.popup = null;
      this.timeoutId = null;
      this.isVisible = false;
      this.animationDuration = 300;
      
      // Initialize after 3 seconds
      setTimeout(() => this.init(), 3000);
    }

    init() {
      try {
        this.createPopup();
        this.showPopup();
        this.setupAutoTimeout();
      } catch (error) {
        console.error('PopupOverlay initialization failed:', error);
      }
    }

    createPopup() {
      // Create popup container
      this.popup = document.createElement('div');
      this.popup.className = 'popup-overlay-container';
      
      // Set styles using CSS-in-JS
      this.applyStyles();
      
      // Create popup content
      this.popup.innerHTML = `
        <div class="popup-overlay-content">
          <button class="popup-overlay-close" aria-label="Close popup">&times;</button>
          <div class="popup-overlay-body">
            <h3>Important Notice</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      `;

      // Add event listeners
      const closeBtn = this.popup.querySelector('.popup-overlay-close');
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hidePopup();
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isVisible) {
          this.hidePopup();
        }
      });

      // Prevent event bubbling on popup content
      this.popup.querySelector('.popup-overlay-content').addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Close on backdrop click
      this.popup.addEventListener('click', () => {
        this.hidePopup();
      });
    }

    applyStyles() {
      // Create and inject CSS styles
      if (!document.getElementById('popup-overlay-styles')) {
        const style = document.createElement('style');
        style.id = 'popup-overlay-styles';
        style.textContent = `
          .popup-overlay-container {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 10000;
            transform: translateY(-100%);
            transition: transform ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }

          .popup-overlay-container.show {
            transform: translateY(0);
          }

          .popup-overlay-content {
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            margin: 20px;
            max-width: 400px;
            width: 100%;
            position: relative;
            border: 1px solid #e5e7eb;
            overflow: hidden;
          }

          .popup-overlay-close {
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            font-size: 24px;
            color: #6b7280;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
            z-index: 1;
            line-height: 1;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .popup-overlay-close:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .popup-overlay-close:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }

          .popup-overlay-body {
            padding: 24px;
          }

          .popup-overlay-body h3 {
            margin: 0 0 16px 0;
            color: #111827;
            font-size: 18px;
            font-weight: 600;
            line-height: 1.4;
          }

          .popup-overlay-body p {
            margin: 0 0 12px 0;
            color: #4b5563;
            font-size: 14px;
            line-height: 1.5;
          }

          .popup-overlay-body p:last-child {
            margin-bottom: 0;
          }

          /* Responsive design */
          @media (max-width: 640px) {
            .popup-overlay-content {
              margin: 12px;
              max-width: calc(100vw - 24px);
            }

            .popup-overlay-body {
              padding: 20px;
            }

            .popup-overlay-body h3 {
              font-size: 16px;
            }

            .popup-overlay-body p {
              font-size: 13px;
            }
          }

          /* Animation for fade out */
          .popup-overlay-container.hide {
            transform: translateY(-100%);
            opacity: 0;
          }

          /* Ensure high z-index for accessibility */
          .popup-overlay-container * {
            box-sizing: border-box;
          }
        `;
        document.head.appendChild(style);
      }
    }

    showPopup() {
      if (this.isVisible) return;

      // Ensure DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.showPopup());
        return;
      }

      try {
        document.body.appendChild(this.popup);
        
        // Trigger animation after element is in DOM
        requestAnimationFrame(() => {
          this.popup.classList.add('show');
          this.isVisible = true;
        });
      } catch (error) {
        console.error('Failed to show popup:', error);
      }
    }

    hidePopup() {
      if (!this.isVisible || !this.popup) return;

      try {
        this.popup.classList.add('hide');
        this.popup.classList.remove('show');
        
        // Clear auto-timeout
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        // Remove from DOM after animation
        setTimeout(() => {
          if (this.popup && this.popup.parentNode) {
            this.popup.parentNode.removeChild(this.popup);
          }
          this.isVisible = false;
        }, this.animationDuration);

        // Remove event listeners
        document.removeEventListener('keydown', this.handleEscapeKey);
      } catch (error) {
        console.error('Failed to hide popup:', error);
      }
    }

    setupAutoTimeout() {
      // Auto-close after 10 seconds
      this.timeoutId = setTimeout(() => {
        this.hidePopup();
      }, 10000);
    }

    // Public API
    destroy() {
      this.hidePopup();
      
      // Remove styles
      const styleEl = document.getElementById('popup-overlay-styles');
      if (styleEl) {
        styleEl.remove();
      }
    }
  }

  // Auto-initialize when script loads
  let popupInstance = null;
  
  // Initialize popup
  function initPopup() {
    if (!popupInstance) {
      popupInstance = new PopupOverlay();
    }
  }

  // Expose public API to window
  window.PopupOverlay = {
    init: initPopup,
    destroy: () => {
      if (popupInstance) {
        popupInstance.destroy();
        popupInstance = null;
      }
    }
  };

  // Auto-initialize if not already done
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopup);
  } else {
    initPopup();
  }

})();