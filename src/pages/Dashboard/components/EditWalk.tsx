import { useNavigate, useParams } from "react-router-dom";
import { EditWalkForm } from "../../../components/forms/EditWalkForm";
import { Separator } from "../../../components/ui/separator";
import { useGetWalkWithDogsById } from "../../../api/hooks/useWalks";
import { errorToast } from "../../../utils/helpers";
import TitleNav from "../../../components/TitleNav";

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
        <div>
            <TitleNav title="Edit Walk" />
            <div className="items-center px-4 md:px-6 pb-6 space-y-8">
                <Separator />
                {walk ? <EditWalkForm walk={walk} /> : null}
            </div>
        </div>
    )
}