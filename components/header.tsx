import { ButtonHTMLAttributes, ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/**
 * Header properties
 */
interface Props {
  readonly children?: ReactNode;
  readonly onClose?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}


/**
 * Header component
 *
 * @param props Header properties
 */
export const Header = ({ children, onClose }: Props): JSX.Element => {
  return (
    <header className="relative text-blueGray-100 bg-blueGray-600 text-center px-2 py-1">
      <h3 className="text-xl font-bold">
        {children}
      </h3>

      {onClose && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center px-2">
          <button onClick={onClose} className="bg-blueGray-300 text-blueGray-800 hover:text-blueGray-600 focus:outline-none focus:ring">
            <FontAwesomeIcon icon="times" fixedWidth />
          </button>
        </div>
      )}
    </header>
  );
};
