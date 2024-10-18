import { useNavigate, useParams } from "react-router-dom";
import { EditWalkForm } from "../../../components/forms/EditWalkForm";
import { Separator } from "../../../components/ui/separator";
import { useGetWalkWithDogsById } from "../../../api/hooks/useWalks";
import { errorToast } from "../../../utils/helpers";
import BackButton from "../../../components/ui/icons/BackButton";

export default function EditWalk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: walk, isLoading } = useGetWalkWithDogsById(id || "");

    if (!id && !isLoading) {
        errorToast(new Error("Walk ID not found"));
        navigate("/dashboard/walks");
    }

    // todo: if not authorized, reroute to dashboard with an error message

    return (
        <div className="p-4 md:p-6 space-y-8">
            <div className="items-center">
                <div className="flex items-center justify-between">
                    <div className="ml-2">
                        <h3 className="text-lg font-medium">Edit Walk</h3>
                        <p className="text-sm text-muted-foreground">
                            Update the details of your walk.
                        </p>
                    </div>
                    <BackButton />
                </div>
                <Separator className="my-6" />
                {walk ? <EditWalkForm walk={walk} /> : null}
            </div>
        </div>
    )
}