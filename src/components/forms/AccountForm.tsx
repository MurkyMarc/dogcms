import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useGetMyProfileById, useUpdateProfile } from "../../api/hooks/useProfile"
import { useSession } from "../../api/hooks/useAuth"
import { useUploadAvatar, useDeleteAvatar } from "../../api/hooks/useAvatar"
import { loadingToast, phoneFormat } from "../../utils/helpers"

const phoneRegex = new RegExp(
    /^([\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const accountFormSchema = z.object({
    email: z.string().readonly().optional(),
    f_name: z
        .string()
        .min(2, "First name must be at least 2 characters.")
        .max(30, "First name must not be longer than 30 characters.")
        .optional(),
    l_name: z
        .string()
        .min(2, "Last name must be at least 2 characters.")
        .max(30, "Last name must not be longer than 30 characters.")
        .optional(),
    phone: z
        .string()
        .min(14, "A phone number requires 10 digits.")
        .regex(phoneRegex)
        .or(z.string().length(0))
        .optional(),
    emergency_phone_1: z
        .string()
        .min(14, "A phone number requires 10 digits.")
        .regex(phoneRegex)
        .or(z.string().length(0))
        .optional(),
    emergency_phone_2: z
        .string()
        .min(14, "A phone number requires 10 digits.")
        .regex(phoneRegex)
        .or(z.string().length(0))
        .optional()
})

export function AccountForm() {
    const { data: session } = useSession();
    const uploadAvatarQuery = useUploadAvatar();
    const deleteAvatarQuery = useDeleteAvatar();
    const updateProfileQuery = useUpdateProfile();
    const { data: profile } = useGetMyProfileById(session?.user.id || "", !!session);
    const isUpdating = updateProfileQuery.isPending || uploadAvatarQuery.isPending || deleteAvatarQuery.isPending;

    type AccountFormValues = z.infer<typeof accountFormSchema>

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            ...profile,
            phone: phoneFormat(profile?.phone || ""),
            emergency_phone_1: phoneFormat(profile?.emergency_phone_1 || ""),
            emergency_phone_2: phoneFormat(profile?.emergency_phone_2 || "")
        },
    })

    async function onSubmit(e: AccountFormValues) {
        loadingToast();
        if(profile) updateProfileQuery.mutate({id: profile.id, ...e});
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
                    name="phone"
                    render={() => (
                        <Controller
                            control={form.control}
                            name="phone"
                            render={({ field: { onChange, value, ...restField } }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"(123) 456-7890"}
                                            value={value}
                                            onChange={e => onChange(phoneFormat(e.target.value))}
                                            {...restField}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                />
                <FormField
                    name="emergency_phone_1"
                    render={() => (
                        <Controller
                            control={form.control}
                            name="emergency_phone_1"
                            render={({ field: { onChange, value, ...restField } }) => (
                                <FormItem>
                                    <FormLabel>Emergency Contact Phone 1</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"(123) 456-7890"}
                                            value={value}
                                            onChange={e => onChange(phoneFormat(e.target.value))}
                                            {...restField}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                />
                <FormField
                    name="emergency_phone_2"
                    render={() => (
                        <Controller
                            control={form.control}
                            name="emergency_phone_2"
                            render={({ field: { onChange, value, ...restField } }) => (
                                <FormItem>
                                    <FormLabel>Emergency Contact Phone 2</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"(123) 456-7890"}
                                            value={value}
                                            onChange={e => onChange(phoneFormat(e.target.value))}
                                            {...restField}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                />
                <Button disabled={isUpdating} type="submit">Update account</Button>
            </form>
        </Form>
    )
}