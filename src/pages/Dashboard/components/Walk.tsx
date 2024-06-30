import { useNavigate, useParams } from "react-router-dom";
import { useGetWalkById } from "../../../api/hooks/useWalks";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import WalkNav from "./WalkNav";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { WalkScrollImage } from "./WalkScrollImage";
import { formatMonthDayFromDateString } from "../../../utils/helpers";

export default function Walk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: walk, isLoading } = useGetWalkById(id || "");

    if (!id && !isLoading) {
        return <div>{"Walk ID not found"}</div>;
    }

    const handleDeleteWalk = () => {
        alert("Delete walk");
    }

    // todo: if not authorized, reroute to dashboard with an error message

    return (
        <div className="p-4 md:p-6 space-y-8">
            <div className="items-center">
                <WalkNav />
                <Separator className="my-6" />

                {isLoading ? "Loading..." :
                    <>
                        <div>
                            <ScrollArea className="rounded-md border mb-8 grid max-w-fit">
                                <div className="flex shrink-0 p-2">
                                    {walk?.dogs?.map((dog) => (
                                        <WalkScrollImage key={dog.id} dog={dog} selectDisabled={true} />
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>

                        <div className="pb-4">
                            <span>Status: </span>
                            <span className="text-sm text-muted-foreground pb-6">
                                {walk?.status}
                            </span>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-2">Appointment</h2>
                            <p className="text-sm text-muted-foreground">
                                {walk?.start && formatMonthDayFromDateString(walk?.start)} at {walk?.subtitle}
                            </p>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-2">Address</h2>
                            <p className="text-sm text-muted-foreground">
                                {walk?.street}, {walk?.city}, {walk?.state}, {walk?.zip}
                            </p>
                        </div>

                        <div className="pb-6">
                            <h2 className="pb-2">Notes</h2>
                            <p className="text-sm text-muted-foreground">
                                {walk?.notes || "No notes"}
                            </p>
                        </div>

                        <div className="">
                            <Button onClick={() => navigate(`/dashboard/walk/${id}/edit`)} variant={"outline"}>Edit Walk</Button>
                            <Button className="ml-4" onClick={handleDeleteWalk} variant={"destructive"}>Delete Walk</Button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

