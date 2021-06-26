import { HTMLAttributes, ButtonHTMLAttributes } from "react";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/**
 * Toggler properties
 */
interface Props {
  readonly id?: ButtonHTMLAttributes<HTMLButtonElement>["id"];
  readonly label?: string;
  readonly title?: HTMLAttributes<HTMLLabelElement>["title"];
  readonly name?: ButtonHTMLAttributes<HTMLButtonElement>["name"];
  readonly value?: ButtonHTMLAttributes<HTMLButtonElement>["value"];
  readonly icon?: IconProp;
  readonly onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}


/**
 * Toggler component
 *
 * @param props Toggler properties
 */
export const Toggler = ({ id, label, title, name, value, icon, onClick }: Props): JSX.Element => {
  return (
    <span title={title} className="flex items-center">
      <button id={id} name={name} type="button" title={title} value={value} onClick={onClick} className={`${icon ? `bg-lightBlue-800 ` : `bg-white hover:bg-blueGray-200 border `}flex justify-center items-center border-blueGray-800 shadow cursor-default focus:outline-none focus:ring w-4 h-4`}>
        {icon && (
          <FontAwesomeIcon icon={icon} fixedWidth className="text-white text-xs" />
        )}
      </button>

      {(label !== undefined) && (
        <label htmlFor={id} className="ml-1">
          {label}
        </label>
      )}
    </span>
  );
};
