'use client'

import {Button} from "@/components/ui/button";

interface Props {
    itemID: string
}

const Index = (
    {itemID}: Props
) => {

    const OnClick = async () => {
        console.log("click", itemID);
    }

    return (
        <Button
            onClick={OnClick}
        >
            Delete
        </Button>
    )
}

export default Index;