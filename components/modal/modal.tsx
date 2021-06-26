import { useEffect, ReactNode } from "react";


/**
 * Modal component properties
 */
interface Props {
  readonly open?: boolean;
  readonly children?: ReactNode;
  readonly onClose?: () => void;
}


/**
 * Modal component
 *
 * @param props Modal properties
 */
export const Modal = ({ open = true, children, onClose }: Props): JSX.Element | null => {
  // Close when press the escape key
  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === `Escape`) {
        onClose();
      }
    };

    document.addEventListener(`keydown`, handleKeyDown, true);
    return () => { document.addEventListener(`keydown`, handleKeyDown, true); };
  }, [ onClose ]);

  // Toggle body scrolling
  useEffect(() => {
    document.body.style.overflowY = open ? `hidden` : ``;
  }, [ open ]);


  // Validate open status
  if (!open) {
    return null;
  }

  // Return modal
  return (
    <div tabIndex={-1} onClick={onClose} className="fixed inset-0 z-50 flex justify-center items-center bg-black select-none bg-opacity-50">
      <div onClick={e => { e.stopPropagation(); } } className="bg-blueGray-50 shadow overflow-auto w-full-4 sm:max-w-screen-sm max-h-full-8">
        {children}
      </div>
    </div>
  );
};
