import { z } from "zod"
import { cn } from "../../utils/cn"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useIsMutating } from "@tanstack/react-query"
import { format } from "date-fns"
import { useCreateDog, useUploadDogImage } from "../../api/hooks/useDog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Textarea } from "../ui/textarea"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useNavigate } from "react-router-dom"
import { generateRandomFileName } from "../../utils/helpers"

const accountFormSchema = z.object({
    name: z
        .string()
        .min(2, "First name must be at least 2 characters.")
        .max(30, "First name must not be longer than 30 characters."),
    breed: z
        .string()
        .min(2, "Breed must be at least 2 characters.")
        .max(30, "Breed must not be longer than 30 characters.")
        .optional()
        .or(z.literal("")),
    dob: z.date().optional(),
    bio: z.
        string()
        .max(300, "Bio must be less than 300 characters.")
        .optional()
});

interface CreateNewDogFormProps {
    image: File | null;
}

export function CreateNewDogForm({ image }: CreateNewDogFormProps) {
    const navigate = useNavigate();
    const isMutating = !!useIsMutating();
    const createDogQuery = useCreateDog();
    const uploadDogImageQuery = useUploadDogImage();

    type AccountFormValues = z.infer<typeof accountFormSchema>

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: "",
            breed: "",
            dob: new Date(),
            bio: ""
        }
    })

    async function onSubmit(e: AccountFormValues) {
        const filePath = image ? generateRandomFileName(image.name.split(".")[1]) : "";
        const data = {
            ...e,
            dob: e.dob?.toISOString() || "",
            image: filePath
        };
        
        const promises = [];
        promises.push(createDogQuery.mutateAsync(data));
        if (image) promises.push(uploadDogImageQuery.mutateAsync({ filePath, file: image }));
        await Promise.all(promises);
        navigate("/dashboard");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder={"Enter a name"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Breed</FormLabel>
                            <FormControl>
                                <Input placeholder={"Enter a breed"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        fromYear={2000}
                                        toYear={new Date().getFullYear()}
                                        captionLayout="dropdown-buttons"
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                This is used to calculate age.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={"Aa"}
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Tell us about your dog! Let us know about any special care they may need.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isMutating} type="submit">Submit</Button>
            </form>
        </Form>
    )
}