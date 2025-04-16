export interface InputProps {
    label?: string;
    placeholder: string;
    type: string;
    onChange: (value: any) => void;
    light?: boolean
    value?: any
}