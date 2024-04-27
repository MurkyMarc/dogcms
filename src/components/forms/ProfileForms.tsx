import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useGetMyProfileById } from "../../api/hooks/useProfile"
import { useSession } from "../../api/hooks/useAuth"

const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    email: z
        .string({
            required_error: "Please select an email to display.",
        })
        .email(),
    bio: z.string().max(160, {
        message: "Your bio can be up to 160 characters.",
    }).optional()
})

export function ProfileForm() {
    const { data: session } = useSession();
    const { data: profile } = useGetMyProfileById(session?.user.id || "", !!session);

    type ProfileFormValues = z.infer<typeof profileFormSchema>

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: { ...profile },
        mode: "onChange",
    })

    function onSubmit(e: ProfileFormValues) {
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
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder={"Aa"} {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name visible on the site to others.
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
                <Button type="submit">Update profile</Button>
            </form>
        </Form>
    )
}