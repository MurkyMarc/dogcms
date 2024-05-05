import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useUpdateProfile } from "../../api/hooks/useProfile"
import { Tables } from "../../utils/database.types"
import { Session } from "@supabase/supabase-js"
import { useIsMutating } from '@tanstack/react-query'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const zipRegex = new RegExp(
    /^[0-9]{5}$/
);

const accountAddressFormSchema = z.object({
    street: z
        .string()
        .min(2, "Street name must be at least 2 characters.")
        .max(30, "Street name must not be longer than 30 characters.")
        .optional(),
    city: z
        .string()
        .min(2, "City name must be at least 2 characters.")
        .max(30, "City name must not be longer than 30 characters.")
        .optional(),
    state: z.string(),
    zip: z
        .string()
        .regex(zipRegex, "Zipcode can only container numbers 0-9")
        .min(5, "Zipcode must be 5 characters.")
        .max(5, "Zipcode must be 5 characters.")
        .optional()
})

interface AccountAddressFormProps {
    profile: Tables<'profiles'>;
    session: Session
}

export function AccountAddressForm({ profile }: AccountAddressFormProps) {
    const isMutating = !!useIsMutating()
    const updateProfileQuery = useUpdateProfile();

    type AccountFormValues = z.infer<typeof accountAddressFormSchema>

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountAddressFormSchema),
        defaultValues: {
            ...profile,
            state: "NY"
        }
    })

    async function onSubmit(e: AccountFormValues) {
        updateProfileQuery.mutate({ id: profile.id, ...e });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Zipcode</FormLabel>
                            <FormControl>
                                <Input placeholder={"10001"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isMutating} type="submit">Update address</Button>
            </form>
        </Form>
    )
}