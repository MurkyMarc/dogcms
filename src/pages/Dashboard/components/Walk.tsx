import { useNavigate, useParams } from "react-router-dom";
import { useGetWalkById, useUpdateWalkStatus } from "../../../api/hooks/useWalks";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import WalkNav from "./WalkNav";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { WalkScrollImage } from "./WalkScrollImage";
import { formatMonthDayFromDateString } from "../../../utils/helpers";
import { useProfile } from "../../../api/hooks/useAuth";

export default function Walk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: walk, isLoading } = useGetWalkById(id || "");
    const { data: profile } = useProfile();
    const { mutate: updateWalkStatus } = useUpdateWalkStatus();

    if (!id && !isLoading) {
        return <div>{"Walk ID not found"}</div>;
    } else if (!id) {
        return <div>{"Walk not found"}</div>;
    }

    const handleStartWalk = () => {
        updateWalkStatus({ id, status: 'active' });
    }

    const handleEndWalk = () => {
        updateWalkStatus({ id, status: 'completed' });
    }

    const handleCancelWalk = () => {
        updateWalkStatus({ id, status: 'cancelled' });
    }


    const handleSetToNotScheduled = () => {
        updateWalkStatus({ id, status: 'not scheduled' });
    }

    // todo: if not authorized, reroute to dashboard with an error message

    return (
        <div className="p-4 md:p-6 space-y-8">
            <div className="items-center">
                <WalkNav />
                <Separator className="my-6" />

                {isLoading ? "Loading..." :
                    <>
                        <div className="flex justify-center sm:justify-start">
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

                        {profile?.role === 'admin' || profile?.role === 'employee' ? 
                            <div className="pb-6">
                                <h2 className="pb-2">Admin Notes</h2>
                                <p className="text-sm text-muted-foreground">
                                    {walk?.admin_notes || "No admin notes"}
                                </p>
                            </div>
                        : null}

                        <div>
                            {profile?.role === 'customer' ? (
                                <div className="flex justify-center sm:justify-start pt-4">
                                    <Button onClick={() => navigate(`/dashboard/walk/${id}/edit`)} variant={"outline"}>Edit Walk</Button>
                                    <Button className="ml-4" onClick={handleCancelWalk} variant={"destructive"}>Cancel Walk</Button>
                                </div>
                            ) : profile?.role === 'admin' ? (
                                    <>
                                        <div className="flex justify-center sm:justify-start pt-4">
                                            <Button onClick={() => navigate(`/dashboard/walk/${id}/edit`)} variant={"outline"}>Edit Walk</Button>
                                            <Button className="ml-4" onClick={handleCancelWalk} variant={"destructive"}>Cancel Walk</Button>
                                        </div>
                                        <div className="flex justify-center sm:justify-start pt-4">
                                            <Button onClick={handleStartWalk} variant={"outline"}>Start Walk</Button>
                                            <Button className="ml-4" onClick={handleEndWalk} variant={"outline"}>End Walk</Button>
                                        </div>
                                        <div className="flex justify-center sm:justify-start pt-4">
                                            <Button className="ml-4" onClick={handleSetToNotScheduled} variant={"outline"}>Set To Not Scheduled</Button>
                                        </div>
                                    </>
                            ) : (
                                // This is the employee view
                                <div className="flex justify-center sm:justify-start pt-4">
                                    <Button onClick={handleStartWalk} variant={"outline"}>Start Walk</Button>
                                    <Button className="ml-4" onClick={handleEndWalk} variant={"outline"}>End Walk</Button>
                                </div>
                            )}
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

