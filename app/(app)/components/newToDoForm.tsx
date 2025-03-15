'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useState} from "react";
import Form from "next/form";
import {Button} from "@/components/ui/button";

interface Props {
    onSubmit: (data: FormData) => void;
}

const Index = (
    {onSubmit}: Props
) => {

    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    // On form submit
    const OnSubmit = (formData: FormData): void => {
        onSubmit(formData)
        setDialogOpen(false)
    }

    return (
        <Dialog
            onOpenChange={() => setDialogOpen(!dialogOpen)}
            open={dialogOpen}
        >
            <DialogTrigger
                className={'mr-2 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-2 py-1 sm:px-4 sm:py-2 has-[>svg]:px-3 rounded-md text-sm font-medium'}
            >
                Create
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        ToDo
                    </DialogTitle>
                </DialogHeader>

                <Form
                    action={OnSubmit}
                    className={'grid space-y-4'}
                >

                    <div className="">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            className={'w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary '}
                            required={true}
                            autoComplete={'off'}
                        />
                    </div>

                    <div className="">
                        <label htmlFor="desc">Description</label>
                        <textarea
                            name="desc"
                            id="desc"
                            className={'w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary'}
                        />
                    </div>

                    <Button
                        type="submit"
                        className={'w-fit flex justify-self-end px-2 py-1 sm:px-4 sm:py-2'}
                    >
                        Create
                    </Button>

                </Form>

            </DialogContent>
        </Dialog>
    )
}

export default Index;