import React, {SelectHTMLAttributes} from "react";

import './style.css';

interface selectProps extends SelectHTMLAttributes <HTMLSelectElement> {
    label: string;
    name: string;
    options: Array <{
        value: string;
        label: string;
    }>
}
const Select: React.FC<selectProps> = ({label, name, options, ...rest}) => {
    return (
        <div className="select-block">
            <label htmlFor={name}>{label}</label>
            <select value="" id={name} {...rest}>
                <option value="" disabled hidden>Selecione uma opção</option>
                {
                    options.map(options => {
                        return <option key={options.value} value={options.value}>{options.label}</option>
                    })
                }
            </select>
        </div>
    );
}

export default Select;