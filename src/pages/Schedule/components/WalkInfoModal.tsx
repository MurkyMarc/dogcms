import { SchedulerProjectData } from "@bitnoi.se/react-scheduler";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "../../../components/ui/dialog";
import { useGetWalkById } from "../../../api/hooks/useWalks";
import { useGetEmployees } from "../../../api/hooks/useProfile";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useCallback, useState } from "react";
import { Edit } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { ConfirmationDialog } from "../../../components/ConfirmationDialogue";
import { Tables } from "../../../utils/database.types";

interface WalkInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    walkInfo: SchedulerProjectData | null;
}

export const WalkInfoModal: React.FC<WalkInfoModalProps> = ({ isOpen, onClose, walkInfo }) => {
    const { data: employees } = useGetEmployees();
    const { data: walk } = useGetWalkById(walkInfo?.id?.toString() || "");
    const [selectedWalker, setSelectedWalker] = useState<Partial<Tables<'profiles'>> | null>(walk?.walker || null);
    const [optionSelected, setOptionSelected] = useState<boolean | null>(false);
    const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const confirmModalDisplayed = showConfirmCancelModal || showConfirmDeleteModal;
    const startTime = walkInfo?.startDate.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });
    const endTime = walkInfo?.endDate.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });

    const differentWalkerSelected = () => {
        if(!selectedWalker) return false;
        if(!walk?.walker) return true;
        return selectedWalker?.id !== walk?.walker?.id;
    };

    const handleModalClose = () => {
        // if the user cancels the modal, reset the selected walker
        setSelectedWalker(walk?.walker || null);
        setOptionSelected(false);
        onClose();
    };

    const handleAssignWalker = () => {
        // todo - assign the new walker to the walk
        onClose();
    };

    const handleOptionChange = (walkerId: string) => {
        setOptionSelected(true)
        setSelectedWalker(getWalkerWithId(walkerId));
    };

    const handleEditWalk = () => {
        console.log(walk);
    };

    const handleCancelWalk = () => {
        setShowConfirmCancelModal(true);
    };

    const handleDeleteWalk = () => {
        setShowConfirmDeleteModal(true);
    };

    const handleConfirmModalCancel = () => {
        setShowConfirmCancelModal(false)
        setShowConfirmDeleteModal(false)
    };

    const handleModalConfirmCancelWalk = () => {
        cancelWalk();
        handleConfirmModalCancel();
        handleModalClose();
    };

    const handleModalConfirmDeleteWalk = () => {
        deleteWalk();
        handleConfirmModalCancel();
        handleModalClose();
    };

    const cancelWalk = () => {
        console.log("Cancel Walk");
    };

    const deleteWalk = () => {
        console.log("Delete Walk");
    };

    const getWalkerWithId = useCallback((id: string) => {
        const employee = employees?.find((employee) => employee.id === id);
        if (employee) return employee;
        return null;
    }, [employees]);

    if (!walkInfo) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleModalClose}>
            <ConfirmationDialog
                overlayStyles="bg-black/50"
                title="Cancel Walk Confirmation"
                text="Are you sure you want cancel this walk?"
                onConfirm={handleModalConfirmCancelWalk}
                onCancel={handleConfirmModalCancel}
                isOpen={showConfirmCancelModal}
            />
            <ConfirmationDialog
                overlayStyles="bg-black/50"
                title="Delete Walk Confirmation"
                text="Are you sure you want to delete this walk?"
                onConfirm={handleModalConfirmDeleteWalk}
                onCancel={handleConfirmModalCancel}
                isOpen={showConfirmDeleteModal}
            />
            <DialogOverlay className="bg-black/40" />
            <DialogContent className={confirmModalDisplayed ? "hidden" : ""}>
                <DialogHeader>
                    <DialogTitle>Walker: {walkInfo.title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p><strong>Date:</strong> {walkInfo.startDate.getMonth() + 1}/{walkInfo.startDate.getDate()}/{walkInfo.startDate.getFullYear()}</p>
                    <p><strong>Time:</strong> {startTime} - {endTime}</p>
                    <p><strong>Status:</strong> {walk?.status}</p>
                </div>
                <div className="flex">
                    <div className="flex-2">
                        <Select onValueChange={(value) => handleOptionChange(value)}>
                            <SelectTrigger className="">
                                <SelectValue placeholder={selectedWalker ? `${selectedWalker.f_name} ${selectedWalker.l_name}` : "Select a walker"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Employees</SelectLabel>
                                    {employees?.map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id}>
                                            {`${employee.f_name} ${employee.l_name}`}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 ml-4">
                        <Button disabled={!optionSelected || !differentWalkerSelected()} onClick={handleAssignWalker}>Assign Walker</Button>
                    </div>
                </div>

                <Separator className="my-6 border-b-2 border-neutral-200" />

                <div className="flex justify-between">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a href={`/dashboard/walk/${walk?.id}/edit`} target="_blank">
                                    <Edit onClick={handleEditWalk} className="cursor-pointer hover:text-blue-500" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Walk</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div>
                        <Button variant={"destructive"} className="mr-4" onClick={handleCancelWalk}>Cancel Walk</Button>
                        <Button variant={"destructive"} onClick={handleDeleteWalk}>Delete Walk</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};