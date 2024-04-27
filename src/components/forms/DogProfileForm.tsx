import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useGetMyProfileById, useUpdateProfile } from "../../api/hooks/useProfile"
import { useSession } from "../../api/hooks/useAuth"
import { useUploadAvatar, useDeleteAvatar } from "../../api/hooks/useAvatar"
import { useState } from "react"
import { phoneFormat } from "../../utils/helpers"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../../utils/cn"
import { Calendar } from "../ui/calendar"

const phoneRegex = new RegExp(
    /^([\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const accountFormSchema = z.object({
    f_name: z
        .string()
        .min(2, {
            message: "First name must be at least 2 characters.",
        })
        .max(30, {
            message: "First name must not be longer than 30 characters.",
        }).optional(),
    l_name: z
        .string()
        .min(2, {
            message: "Last name must be at least 2 characters.",
        })
        .max(30, {
            message: "Last name must not be longer than 30 characters.",
        }).optional(),
    email: z.string().readonly().optional(),
    dob: z.date({
        required_error: "A date of birth is required.",
    }).optional(),
    phone: z.string().regex(phoneRegex, 'Please enter a valid phone number.').or(z.string().length(0)).optional(),
    emergency_phone_1: z.string().regex(phoneRegex, 'Please enter a valid phone number.').or(z.string().length(0)).optional(),
    emergency_phone_2: z.string().regex(phoneRegex, 'Please enter a valid phone number.').or(z.string().length(0)).optional()
})

export function DogProfileForm() {
    const { data: session } = useSession();
    const uploadAvatarQuery = useUploadAvatar();
    const deleteAvatarQuery = useDeleteAvatar();
    const updateProfileQuery = useUpdateProfile();
    const { data: profile } = useGetMyProfileById(session?.user.id || "", !!session);
    const isUpdating = updateProfileQuery.isPending || uploadAvatarQuery.isPending || deleteAvatarQuery.isPending;

    const [phoneInput, setPhoneInput] = useState(phoneFormat(profile?.phone || ""));
    const [emergencyContact1Input, setEmergencyContact1Input] = useState(phoneFormat(profile?.emergency_phone_1 || ""));
    const [emergencyContact2Input, setEmergencyContact2Input] = useState(phoneFormat(profile?.emergency_phone_2 || ""));

    type AccountFormValues = z.infer<typeof accountFormSchema>

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: { ...profile },
    })

    function onSubmit(e: AccountFormValues) {
        console.log(e)
        toast("Loading...", {
            cancel: {
                label: 'Dismiss',
                onClick: () => { },
            },
            duration: 2000
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={() => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder={session?.user.email} disabled readOnly />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="f_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder={"Your name"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="l_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder={"Your name"} {...field} />
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
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
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
                    name="phone"
                    render={() => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={"(123) 456-7890"}
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(phoneFormat(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="emergency_phone_1"
                    render={() => (
                        <FormItem>
                            <FormLabel>Emergency Contact Phone 1</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={"(123) 456-7890"}
                                    value={emergencyContact1Input}
                                    onChange={(e) => setEmergencyContact1Input(phoneFormat(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="emergency_phone_2"
                    render={() => (
                        <FormItem>
                            <FormLabel>Emergency Contact Phone 2</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={"(123) 456-7890"}
                                    value={emergencyContact2Input}
                                    onChange={(e) => setEmergencyContact2Input(phoneFormat(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isUpdating} type="submit">Update account</Button>
            </form>
        </Form>
    )
}