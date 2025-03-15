'use client'

import React from "react";

interface Props {
    label: string
    id: string
    type: "email" | "password" | "text"
    placeholder: string
    required: boolean
    rootClassName?: HTMLDivElement['className'] | string
    inputClassName?: HTMLInputElement['className'] | string
    labelClassName?: HTMLLabelElement['className'] | string
    value: string
    setValue: (value: string) => void
    children?: React.ReactNode
}

const Index = (
    props: Props
) => {


    return (
        <div
            className={props.rootClassName}
        >
            <label
                htmlFor={props.id}
                className={props.labelClassName}
            >
                {props.label}
            </label>
            <input
                id={props.id}
                name={props.label}
                type={props.type}
                placeholder={props.placeholder}
                className={props.inputClassName}
                autoComplete={'off'}
                required={props.required}
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
            />
            {props.children}
        </div>
    )
}

export default Index