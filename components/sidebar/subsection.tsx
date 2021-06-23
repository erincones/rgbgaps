import { useState, useCallback, ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/**
 * Subsection component properties
 */
interface SubsectionProps {
  readonly title: string;
  readonly defaultOpen?: boolean;
  readonly children: ReactNode;
}


/**
 * Subsection component
 *
 * @param props Subsection component properties
 * @returns Subsection component
 */
export const Subsection = ({ title, defaultOpen = false, children }: SubsectionProps): JSX.Element => {
  const [ open, setOpen ] = useState(defaultOpen);
  const [ focused, setFocused ] = useState(false);

  // Click handler
  const handleClick = useCallback(() => { setOpen(open => !open); }, []);

  // Handle focus
  const handleFocus = useCallback(() => { setFocused(true); }, []);

  // Handle focus
  const handleBlur = useCallback(() => { setFocused(false); }, []);


  // Return subsection component
  return (
    <li className="py-1">
      {/* Header */}
      <header className="hover:text-blueGray-700 mb-1">
        <button
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex justify-between focus:outline-none pr-0.5 w-full"
        >
          <h6 className="font-bold">{title}</h6>
          <span className={focused ? `ring` : undefined}>
            <FontAwesomeIcon icon={open ? `angle-up` : `angle-down`} fixedWidth />
          </span>
        </button>
      </header>

      {/* Body */}
      {open && <ul className="pl-2">{children}</ul>}
    </li>
  );
};
