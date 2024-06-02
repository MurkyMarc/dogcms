import { useParams } from "react-router-dom";
import { Separator } from "../../../components/ui/separator";
import { useGetWalkById } from "../../../api/hooks/useWalks";
import WalkNav from "./WalkNav";
import { Messages } from "../Messages/Messages";

export default function WalkChat() {
    const { id } = useParams();
    const { isLoading } = useGetWalkById(id || "");

    if (!id && !isLoading) {
        return <div>{"Walk ID not found"}</div>;
    }

    // todo: if not authorized, reroute to dashboard with an error message

    return (
        <div className="p-6 space-y-8">
            <div className="items-center">
                <WalkNav />
                <Separator className="my-6" />
                <div>
                    <Messages />
                </div>
            </div>
        </div>
    )
}