import { useEffect } from "react";
import { X } from "lucide-react";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const Modal = ({ isOpen, onClose, title, subtitle, size = "md", children, footer, hideClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title || "Modal"}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${SIZES[size] || SIZES.md} no-scrollbar max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl`}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-4">
            <div className="min-w-0">
              {title && <h3 className="text-lg font-medium text-white">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className="cursor-pointer shrink-0 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-neutral-800 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
