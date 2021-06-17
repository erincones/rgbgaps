import { ButtonHTMLAttributes, ReactNode } from "react";


/**
 * Button component properties
 */
interface Props {
  readonly title?: ButtonHTMLAttributes<HTMLButtonElement>["title"];
  readonly active?: boolean;
  readonly children?: ReactNode;
  readonly onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}


/**
 * Button component
 *
 * @param props Button component properties
 */
export const Button = ({ title, active, children, onClick }: Props): JSX.Element => {
  return (
    <button title={title} onClick={onClick} className={`${active ? `text-lightBlue-800 ` : `text-blueGray-800 `}hover:text-blueGray-600 focus:outline-none focus:ring`}>
      {children}
    </button>
  );
};
