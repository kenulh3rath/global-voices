'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



interface Props {
    defaultValue: string;
    setValue: (value: string) => void;
}

const Index = (
    {defaultValue, setValue}: Props
) => {

    const roles = [
        "ADMIN",
        "VIEWER",
    ]

    return (
        <Select
            defaultValue={defaultValue}
            onValueChange={(value) => {
                console.log(value);
                setValue(value);
                }
            }
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
                {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                        {role}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

    )
}

export default Index;