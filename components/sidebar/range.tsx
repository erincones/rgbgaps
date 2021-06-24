import { InputHTMLAttributes } from "react";


/**
 * Checkbox properties
 */
interface Props {
  readonly id?: InputHTMLAttributes<HTMLInputElement>["id"];
  readonly label?: string;
  readonly name?: InputHTMLAttributes<HTMLInputElement>["name"];
  readonly value?: InputHTMLAttributes<HTMLInputElement>["value"];
  readonly span?: InputHTMLAttributes<HTMLInputElement>["value"];
  readonly min?: InputHTMLAttributes<HTMLInputElement>["min"];
  readonly max?: InputHTMLAttributes<HTMLInputElement>["max"];
  readonly step?: InputHTMLAttributes<HTMLInputElement>["step"];
  readonly onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
}


/**
 * Range component
 *
 * @param props Range properties
 */
export const Range = ({ id, label, name, value, span, min, max, step, onChange }: Props): JSX.Element => {
  return (
    <>
      <div>
        {(label !== undefined) && (
          <label htmlFor={id} className="inline-block w-1/3">
            {label}
          </label>
        )}
        {(span !== undefined) && (
          <span className="font-mono select-text whitespace-pre ml-2">
            {span}
          </span>
        )}
      </div>
      <input id={id} name={name} type="range" value={value} min={min} max={max} step={step} onChange={onChange} className="w-full" />
    </>
  );
};
