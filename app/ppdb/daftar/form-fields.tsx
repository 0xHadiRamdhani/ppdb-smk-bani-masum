import type { ChangeEvent } from "react";

type TextFieldProps = {
    name: string;
    label: string;
    type?: "text" | "date" | "tel";
};

export function TextField({ name, label, type = "text" }: TextFieldProps) {
    return <label className="block text-sm font-bold">
        {label}
        <input required name={name} type={type} className="mt-2 block w-full border-[3px] border-ink bg-paper px-4 py-3 font-normal outline-none focus:bg-paper-soft" />
    </label>;
}

type UploadFieldProps = {
    name: string;
    label: string;
    filename?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function UploadField({ name, label, filename, onChange }: UploadFieldProps) {
    return <label className="block text-sm font-bold">
        {label}
        <input required name={name} type="file" accept=".pdf,image/*" onChange={onChange} className="mt-2 block w-full border-[3px] border-ink p-3 font-normal" />
        {filename && <span className="mt-1 block text-xs font-normal">{filename}</span>}
    </label>;
}

export function StepIndicator({ steps, currentStep }: { steps: string[]; currentStep: number }) {
    return <div className="mb-8 grid grid-cols-4 gap-2">
        {steps.map((label, index) => <div key={label} className={`border-b-[3px] pb-2 text-center text-xs font-bold ${index <= currentStep ? "border-ink" : "border-neutral-300 text-neutral-400"}`}>
            <span className="font-display text-xl">0{index + 1}</span>
            <br />
            {label}
        </div>)}
    </div>;
}
