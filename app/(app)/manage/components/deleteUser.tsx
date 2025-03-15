'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import { RiDeleteBin6Line } from "react-icons/ri";


interface Props {
    deleteUser: () => void;
}

const Index = (
    {deleteUser}: Props
) => {

    const [open, setOpen] = useState<boolean>(false)

    return (
        <Dialog
            open={open}
            onOpenChange={() => setOpen(!open)}
        >
            <DialogTrigger>
                <RiDeleteBin6Line />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete this user
                        and remove user data from our servers.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={deleteUser}
                    >
                        Delete
                    </Button>
                </DialogFooter>

            </DialogContent>

        </Dialog>

    )
}

export default Index;