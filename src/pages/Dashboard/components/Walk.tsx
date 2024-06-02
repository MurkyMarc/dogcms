import { useNavigate, useParams } from "react-router-dom";
import { useGetWalkById } from "../../../api/hooks/useWalks";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import WalkNav from "./WalkNav";

export default function Walk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: walk, isLoading } = useGetWalkById(id || "");

    console.log(walk);

    if (!id && !isLoading) {
        return <div>{"Walk ID not found"}</div>;
    }

    // todo: if not authorized, reroute to dashboard with an error message

    return (
        <div className="p-6 space-y-8">
            <div className="items-center">
                <div className="pb-4">
                    <h3 className="text-lg font-medium">Walk Chat</h3>
                    <p className="text-sm text-muted-foreground">
                        Talk with your walker
                    </p>
                </div>
                <WalkNav />
                <Separator className="my-6" />
                <div>
                    <Button onClick={() => navigate(`/dashboard/walk/${id}/edit`)} variant={"outline"}>Edit</Button>
                </div>
            </div>
        </div>
    )
}