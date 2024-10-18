import { useParams } from "react-router-dom";
import { useGetWalkWithDogsById } from "../../../api/hooks/useWalks";
import WalkNav from "./WalkNav";
import { Conversation } from "../Messages/Conversation";

export default function WalkChat() {
    const { id } = useParams();
    const { isLoading } = useGetWalkWithDogsById(id || "");

    if (!id && !isLoading) {
        return <div>{"Walk ID not found"}</div>;
    }

    // todo: if not authorized, reroute to dashboard with an error message

    return (
        <div className="p-4 md:p-6 space-y-8">
            <div className="items-center">
                <WalkNav />
                <div>
                    {id ? <Conversation walkId={id} /> : <div>Loading...</div>}
                </div>
            </div>
        </div>
    )
}