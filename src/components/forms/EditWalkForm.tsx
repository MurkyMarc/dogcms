import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Tables } from "../../utils/database.types"
import { useIsMutating } from '@tanstack/react-query'
import { useUpdateWalkAndDogWalks } from "../../api/hooks/useWalks"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "../ui/calendar"
import { cn } from "../../utils/cn"
import { calculateDatetimeFromDateAndTime, calculateEndDatetimeFromDateAndMinutes, durationOptions, getArrayDifferences, getTimeStringFromDatetimeString, getTimeDifferenceInMinutes, timeOptions, zipRegex } from "../../utils/helpers"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { WalkScrollImage } from "../../pages/Dashboard/components/WalkScrollImage"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSession } from "../../api/hooks/useAuth"
import { useGetDogsByOwner } from "../../api/hooks/useDog"

const createWalkFormSchema = z.object({
    date: z.date(),
    start: z.string(),
    duration: z.string(),
    street: z
        .string()
        .min(2, "Street name must be at least 2 characters.")
        .max(30, "Street name must not be longer than 30 characters."),
    city: z
        .string()
        .min(2, "City name must be at least 2 characters.")
        .max(30, "City name must not be longer than 30 characters."),
    state: z.string(),
    zip: z
        .string()
        .regex(zipRegex, "Zip Code must be between 10000 and 12000"),
    notes: z
        .string()
        .min(0)
        .max(300)
})

interface EditWalkFormProps {
    walk: Tables<'walks_with_dogs'>;
}

export function EditWalkForm({ walk }: EditWalkFormProps) {
    const navigate = useNavigate();
    const isMutating = !!useIsMutating()
    const updateWalkQuery = useUpdateWalkAndDogWalks();
    const { data: session } = useSession();
    const { data: dogs } = useGetDogsByOwner(session?.user.id || "");
    const originalDogIds = useRef(walk.dogs.map(dog => dog.id));
    const [selectedDogIds, setSelectedDogIds] = useState<number[]>(walk.dogs.map(dog => dog.id));
    const initialTime = timeOptions.filter(option => option.value === getTimeStringFromDatetimeString(walk.start))[0]?.name || timeOptions[0].name;
    const initialDuration = getTimeDifferenceInMinutes(new Date(walk.start), new Date(walk.end));

    type CreateWalkFormValues = z.infer<typeof createWalkFormSchema>

    const form = useForm<CreateWalkFormValues>({
        resolver: zodResolver(createWalkFormSchema),
        defaultValues: {
            date: new Date(walk.start),
            start: getTimeStringFromDatetimeString(walk.start),
            duration: initialDuration.toString(),
            street: walk.street,
            city: walk.city,
            state: walk.state,
            zip: walk.zip,
            notes: walk.notes
        }
    })

    async function onSubmit(e: CreateWalkFormValues) {
        const startDateTime = calculateDatetimeFromDateAndTime(e.date, e.start);
        const end = calculateEndDatetimeFromDateAndMinutes(startDateTime, Number(e.duration));
        const newWalk = {
            id: walk.id,
            start: startDateTime.toLocaleString(),
            end: end.toLocaleString(),
            street: e.street,
            city: e.city,
            state: e.state,
            zip: e.zip,
            notes: e.notes,
        }

        const { added, removed } = getArrayDifferences(originalDogIds.current, selectedDogIds);
        await updateWalkQuery.mutateAsync({ walk: newWalk, addedDogIds: added, removedDogIds: removed });
        navigate('/dashboard/walks');
    }

    return (
        <>
            <p className="text-m font-bold">
                1. Select the dog(s) going on the walk
            </p>
            <ScrollArea className="rounded-md border mb-8 grid max-w-fit">
                <div className="flex shrink-0 p-2">
                    {dogs?.map((dog) => (
                        <WalkScrollImage key={dog.id} dog={dog} setDogIds={setSelectedDogIds} selectedDogIds={selectedDogIds} />
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <p className="text-m pb-6 font-bold">
                2. Enter the walk details
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="w-fit" >Date to schedule</FormLabel>
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
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4">
                        <div className="flex-1 max-w-48">
                            <FormField
                                control={form.control}
                                name="start"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue {...field} placeholder={initialTime} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {timeOptions.map((option, index) => (
                                                            <SelectItem key={index} value={option.value}>{option.name}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1  max-w-48">
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue {...field} placeholder={`${initialDuration} minutes`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {durationOptions.map((option, index) => (
                                                            <SelectItem key={index} value={option.value}>{option.name}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="max-w-96">
                        <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street</FormLabel>
                                    <FormControl>
                                        <Input placeholder={"123 Main Street"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex max-w-96 gap-4">
                        <div className="flex-3">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"Brooklyn"} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1 max-w-32">
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Select disabled>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue {...field} defaultValue="NY" placeholder="NY" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="NY">New York</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="max-w-48">
                        <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder={"10001"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={"Aa"}
                                        className="resize-none max-w-3xl"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please provide any additional notes you would like to add.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isMutating} type="submit">Update Walk</Button>
                </form>
            </Form>
        </>
    )
}