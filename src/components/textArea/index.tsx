import type { RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextAreaProps {
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  rows?: number;
}

export function TextArea({
  name,
  placeholder,
  register,
  rules,
  error,
  rows,
}: TextAreaProps) {
  return (
    <div>
      <textarea
        className="w-full rounded-md px-2"
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
        rows={rows}
      />
      {error && <p className="my-1 text-red-800">{error}</p>}
    </div>
  );
}
