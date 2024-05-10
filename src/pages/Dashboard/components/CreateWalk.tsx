import { useSession } from "../../../api/hooks/useAuth";
import { Separator } from "../../../components/ui/separator";
import { useGetMyProfileById } from "../../../api/hooks/useProfile";
import { CreateWalkForm } from "../../../components/forms/CreateWalkForm";

export default function CreateWalk() {
    const { data: session } = useSession();
    const { data: profile } = useGetMyProfileById(session?.user.id || "", !!session);

    return (
        <div className="p-6 space-y-8">
            <div className="items-center">
                <div>
                    <h3 className="text-lg font-medium">Schedule a Walk</h3>
                    <p className="text-sm text-muted-foreground">
                        Schedule a walk for your dog(s).
                    </p>
                </div>
                <Separator className="my-6" />
                {profile ? <CreateWalkForm profile={profile} /> : null}
            </div>
        </div>
    )
}