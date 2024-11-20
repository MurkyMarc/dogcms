import { useNavigate, useParams } from "react-router-dom";
import { useDeleteWalkById, useGetWalkWithDogsById, useUpdateWalk } from "../../../api/hooks/useWalks";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import WalkNav from "./WalkNav";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { WalkScrollImage } from "./WalkScrollImage";
import { formatDateStringToAmPmString, formatMonthDayFromDateString } from "../../../utils/helpers";
import { useProfile } from "../../../api/hooks/useAuth";
import { useState } from "react";
import { ConfirmationDialog } from "../../../components/ConfirmationDialogue";
import { useDeductProfileCredits } from "../../../api/hooks/useProfile";
import { errorToast } from "../../../utils/helpers";

export default function Walk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: walk, isLoading, isError, isSuccess } = useGetWalkWithDogsById(id || "");
    const { data: profile } = useProfile();
    const { mutate: updateWalk } = useUpdateWalk();
    const { mutate: deleteWalkById } = useDeleteWalkById();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { mutateAsync: deductCredits } = useDeductProfileCredits();

    const handleStartWalk = () => {
        id && updateWalk({ id, status: 'active' });
    }

    const handleEndWalk = async () => {
        if (!walk?.customer || !walk?.price) {
            errorToast("Unable to complete walk. Missing customer or price information.");
            return;
        }

        if (walk.status === 'completed') {
            errorToast("This walk has already been completed.");
            return;
        }

        if (walk.status === 'cancelled') {
            errorToast("Cannot complete a cancelled walk.");
            return;
        }

        try {
            // First deduct the credits
            await deductCredits({ 
                userId: walk.customer as unknown as string, 
                credits: walk.price 
            });

            // Then update the walk status
            id && updateWalk({ id, status: 'completed' });
        } catch (error) {
            errorToast("Failed to complete walk. Please try again.");
        }
    }

    const handleCancelWalk = () => {
        setShowCancelModal(true);
    };

    const handleSetToNotScheduled = () => {
        id && updateWalk({ id, status: 'not assigned' });
    }

    const handleDeleteWalk = () => {
        setShowDeleteModal(true);
    }

    const confirmCancelWalk = () => {
        id && updateWalk({ id, status: 'cancelled' });
        setShowCancelModal(false);
    };

    const confirmDeleteWalk = () => {
        id && deleteWalkById(id);
        setShowDeleteModal(false);
    };

    // todo: if not authorized, reroute to dashboard with an error message

    return (
        <div className="p-4 md:p-6 space-y-8">
            <div className="items-center">
                <WalkNav />
                <Separator className="my-6" />

                {isLoading ? <StatusMessage status="Loading..." /> :
                    isError ? <StatusMessage status="Walk not found" /> :
                        isSuccess ?
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
                                        {walk?.start && formatMonthDayFromDateString(walk?.start)} from {formatDateStringToAmPmString(walk!.start)} - {formatDateStringToAmPmString(walk!.end)}
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
                                                <Button onClick={handleSetToNotScheduled} variant={"outline"}>Unassign Walker</Button>
                                                <Button className="ml-4" onClick={handleDeleteWalk} variant={"destructive"}>Delete Walk</Button>
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
                            : null}
            </div>
            <ConfirmationDialog
                title="Cancel Walk"
                text="Are you sure you want to cancel this walk?"
                isOpen={showCancelModal}
                onConfirm={confirmCancelWalk}
                onCancel={() => setShowCancelModal(false)}
            />
            <ConfirmationDialog
                title="Delete Walk"
                text="Are you sure you want to delete this walk? This action cannot be undone."
                isOpen={showDeleteModal}
                onConfirm={confirmDeleteWalk}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    )
}

const StatusMessage = ({ status }: { status: string }) => {
    return (
        <div className="text-center">
            <h1 className="text-lg font-bold">{status}</h1>
        </div>
    )
}
