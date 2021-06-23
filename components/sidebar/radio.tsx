import { HTMLAttributes, InputHTMLAttributes } from "react";


/**
 * Radio properties
 */
interface Props {
  readonly id?: InputHTMLAttributes<HTMLInputElement>["id"];
  readonly label?: string;
  readonly title?: HTMLAttributes<HTMLLabelElement>["title"];
  readonly name?: InputHTMLAttributes<HTMLInputElement>["name"];
  readonly checked?: InputHTMLAttributes<HTMLInputElement>["checked"];
  readonly onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
}


/**
 * Radio component
 *
 * @param props Radio properties
 */
export const Radio = ({ id, label, title, name, checked, onChange }: Props): JSX.Element => {
  return (
    <label htmlFor={id} title={title} className="flex items-center">
      <input id={id} type="radio" name={name} checked={checked} onChange={onChange} className="hover:bg-blueGray-200 text-lightBlue-800 border-blueGray-800 shadow focus:ring focus:ring-offset-0 focus:ring-blue-500 focus:ring-opacity-50" />

      {(label !== undefined) && (
        <span className="ml-1">
          {label}
        </span>
      )}
    </label>
  );
};
