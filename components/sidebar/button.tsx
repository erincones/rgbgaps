import { ButtonHTMLAttributes, ReactNode } from "react";


/**
 * Button component properties
 */
interface Props {
  readonly title?: ButtonHTMLAttributes<HTMLButtonElement>["title"];
  readonly disabled?: ButtonHTMLAttributes<HTMLButtonElement>["disabled"];
  readonly children?: ReactNode;
  readonly onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}


/**
 * Button component
 *
 * @param props Button component properties
 */
export const Button = ({ title, disabled, children, onClick }: Props): JSX.Element => {
  return (
    <button type="button" title={title} disabled={disabled} onClick={onClick} className="bg-white disabled:bg-blueGray-100 hover:bg-blueGray-200 disabled:text-blueGray-400 border disabled:border-blueGray-400 border-blueGray-800 shadow disabled:cursor-not-allowed focus:outline-none focus:ring px-2 mb-1">
      {children}
    </button>
  );
};
