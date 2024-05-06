import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Tables } from "../../utils/database.types"
import { useIsMutating } from '@tanstack/react-query'
import { useCreateWalk } from "../../api/hooks/useWalks"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "../ui/calendar"
import { cn } from "../../utils/cn"
import { calculateEndTime, durationOptions, formatTimeToAmPm, timeOptions, zipRegex } from "../../utils/helpers"

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
    group: z.boolean(),
    notes: z
        .string()
        .min(0)
        .max(300)
        .optional()
})

interface CreateWalkFormProps {
    profile: Tables<'profiles'>;
}

export function CreateWalkForm({ profile }: CreateWalkFormProps) {
    const isMutating = !!useIsMutating()
    const createWalkQuery = useCreateWalk();

    type CreateWalkFormValues = z.infer<typeof createWalkFormSchema>

    const form = useForm<CreateWalkFormValues>({
        resolver: zodResolver(createWalkFormSchema),
        defaultValues: {
            date: new Date(),
            start: '12:00:00',
            duration: '15',
            street: profile.street,
            city: profile.city,
            state: profile.state,
            zip: profile.zip,
            group: true,
            notes: ''
        }
    })

    async function onSubmit(e: CreateWalkFormValues) {
        const end = calculateEndTime(e.start, e.duration);
        const data = {
            customer: profile.id,
            date: e.date.toISOString().split('T')[0],
            start: e.start,
            end,
            street: e.street,
            city: e.city,
            state: e.state,
            zip: e.zip,
            group: e.group,
            notes: e.notes,
            status: 'unscheduled',
            title: `${profile.username}`,
            subtitle: `${formatTimeToAmPm(e.start)} - ${formatTimeToAmPm(end)}`,
            description: `${profile.f_name} ${profile.l_name} - status: unscheduled`
        }
        console.log(data);
        createWalkQuery.mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date to schedule</FormLabel>
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
                                                <SelectValue {...field} placeholder="12:00 PM" />
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
                                                <SelectValue {...field} placeholder="15 minutes" />
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
                <div className="max-w-96">
                    <FormField
                        control={form.control}
                        name="group"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Do you allow your dogs to walk with other people's dogs? <br />
                                </FormLabel>
                                <div className="flex">
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <span className="pl-4 leading-5">{field.value ? "yes" : "no"}</span>
                                </div>
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
                                    className="resize-none"
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
                <Button disabled={isMutating} type="submit">Schedule Walk</Button>
            </form>
        </Form>
    )
}