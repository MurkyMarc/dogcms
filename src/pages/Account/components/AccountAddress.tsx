import { useSession } from "../../../api/hooks/useAuth";
import { useGetMyProfileById } from "../../../api/hooks/useProfile";
import { AccountAddressForm } from "../../../components/forms/AccountAddressForm";
import { Separator } from "../../../components/ui/separator";

export default function AccountAddress() {
    const { data: session } = useSession();
    const { data: profile } = useGetMyProfileById(session?.user.id || "", !!session);
    return (
        <div className="flex-1 lg:max-w-2xl">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Account</h3>
                    <p className="text-sm text-muted-foreground">
                        Set your default address where your dogs will be picked up from. Pickup location can be customized on each scheduled walk.
                    </p>
                </div>
                <Separator />
                {session && profile ? <AccountAddressForm session={session} profile={profile} /> : null}
            </div>
        </div>
    )
}