import { ButtonHTMLAttributes, ReactNode } from "react";


/**
 * Button component properties
 */
interface Props {
  readonly title?: ButtonHTMLAttributes<HTMLButtonElement>["title"];
  readonly children?: ReactNode;
  readonly onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}


/**
 * Button component
 *
 * @param props Button component properties
 */
export const Button = ({ title, children, onClick }: Props): JSX.Element => {
  return (
    <button type="button" title={title} onClick={onClick} className="bg-white hover:bg-blueGray-200 border border-blueGray-800 shadow focus:outline-none focus:ring px-2 mb-1">
      {children}
    </button>
  );
};
