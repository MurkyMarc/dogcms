import { useSession } from "../../../api/hooks/useAuth";
import { Separator } from "../../../components/ui/separator";
import { useGetMyProfileById } from "../../../api/hooks/useProfile";
import { CreateWalkForm } from "../../../components/forms/CreateWalkForm";
import TitleNav from "../../../components/TitleNav";

export default function CreateWalk() {
    const { data: session } = useSession();
    const { data: profile } = useGetMyProfileById(session?.user.id || "");

    return (
        <div>
            <TitleNav title="Schedule a Walk" />
            <div className="items-center px-4 md:px-6 pb-6 space-y-8">
                <Separator />
                {profile ? <CreateWalkForm profile={profile} /> : null}
            </div>
        </div>
    )
}