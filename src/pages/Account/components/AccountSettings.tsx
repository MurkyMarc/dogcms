import { useSession } from "../../../api/hooks/useAuth";
import { useGetMyProfileById } from "../../../api/hooks/useProfile";
import { AccountForm } from "../../../components/forms/AccountForm";
import { Separator } from "../../../components/ui/separator";

export default function AccountSettings() {
    const { data: session } = useSession();
    const { data: profile } = useGetMyProfileById(session?.user.id || "", !!session);
    return (
        <div className="flex-1 lg:max-w-2xl">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Account</h3>
                    <p className="text-sm text-muted-foreground">
                        Update your account settings.
                    </p>
                </div>
                <Separator />
                {session && profile ? <AccountForm session={session} profile={profile} /> : null}
            </div>
        </div>
    )
}