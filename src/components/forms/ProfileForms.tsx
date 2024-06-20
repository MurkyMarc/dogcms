import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { useUpdateProfile } from "../../api/hooks/useProfile"
import { Tables } from "../../utils/database.types"
import { useIsMutating } from '@tanstack/react-query'

const profileFormSchema = z.object({
    bio: z
        .string()
        .max(160, "Your bio can be up to 160 characters.")
        .optional()
})

interface ProfileFormProps {
    profile: Tables<'profiles'>
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const isMutating = !!useIsMutating();
    const updateProfileQuery = useUpdateProfile();

    type ProfileFormValues = z.infer<typeof profileFormSchema>

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: { ...profile },
        mode: "onChange",
    })

    async function onSubmit(e: ProfileFormValues) {
        updateProfileQuery.mutate({ id: profile.id, ...e });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={"Aa"}
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Tell us about yourself!
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isMutating} type="submit">Update profile</Button>
            </form>
        </Form>
    )
}