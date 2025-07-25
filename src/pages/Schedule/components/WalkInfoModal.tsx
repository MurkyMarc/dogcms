import { SchedulerProjectData } from "@bitnoi.se/react-scheduler";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "../../../components/ui/dialog";
import { useDeleteWalkByIdSchedulePage, useGetWalkById, useUpdateWalkerByWalkId, useUpdateWalkSchedulePage } from "../../../api/hooks/useWalks";
import { useGetEmployees } from "../../../api/hooks/useProfile";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useCallback, useState } from "react";
import { Edit } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { ConfirmationDialog } from "../../../components/ConfirmationDialogue";
import { TablesInsert } from "../../../utils/database.types";

interface WalkInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    walkInfo: SchedulerProjectData | null;
}

export const WalkInfoModal: React.FC<WalkInfoModalProps> = ({ isOpen, onClose, walkInfo }) => {
    const { data: employees } = useGetEmployees();
    const { data: walk } = useGetWalkById(walkInfo?.id?.toString() || "");
    const [selectedWalker, setSelectedWalker] = useState<TablesInsert<'profiles'> | null>(walk?.walker || null);
    const [optionSelected, setOptionSelected] = useState<boolean | null>(false);
    const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const { mutate: deleteWalkById } = useDeleteWalkByIdSchedulePage();
    const { mutate: updateWalk } = useUpdateWalkSchedulePage();
    const { mutate: updateWalkerByWalkId } = useUpdateWalkerByWalkId();

    const confirmModalDisplayed = showConfirmCancelModal || showConfirmDeleteModal;
    const startTime = walkInfo?.startDate.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });
    const endTime = walkInfo?.endDate.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });

    const differentWalkerSelected = () => {
        if (selectedWalker === null && walk?.walker) return true;
        if (!selectedWalker) return false;
        if (!walk?.walker) return true;
        return selectedWalker?.id !== walk?.walker?.id;
    };

    const handleModalClose = () => {
        // if the user cancels the modal, reset the selected walker
        setSelectedWalker(walk?.walker || null);
        setOptionSelected(false);
        onClose();
    };

    const handleAssignWalker = () => {
        walk?.id && updateWalkerByWalkId({ walkId: `${walk.id}`, walkerId: selectedWalker?.id || null });
        onClose();
    };

    const handleOptionChange = (walkerId: string) => {
        setOptionSelected(true)
        setSelectedWalker(walkerId === "Not Assigned" ? null : getWalkerWithId(walkerId));
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
        walk?.id && updateWalk({ id: walk.id, status: 'cancelled' });
    };

    const deleteWalk = () => {
        walk?.id && deleteWalkById(walk);
    };

    const getWalkerWithId = useCallback((id: string) => {
        const employee = employees?.find((employee) => employee.id === id);
        if (employee) return employee;
        return null;
    }, [employees]);

    if (!walkInfo) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleModalClose}>
            <DialogOverlay className="bg-black/40" />
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
            <DialogContent className={confirmModalDisplayed ? "hidden" : ""}>
                <DialogHeader>
                    <DialogTitle>Walker: {walkInfo.title === "???" ? "No Walker Assigned" : walkInfo.title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p><strong>Date:</strong> {walkInfo.startDate.getMonth() + 1}/{walkInfo.startDate.getDate()}/{walkInfo.startDate.getFullYear()}</p>
                    <p><strong>Time:</strong> {startTime} - {endTime}</p>
                    <p><strong>Status:</strong> {walk?.status}</p>
                </div>
                <div className="flex">
                    <div className="flex-2">
                        <Select onValueChange={(value) => handleOptionChange(value)}>
                            <SelectTrigger>
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
                                    <SelectItem className="text-white bg-red-500" value="Not Assigned">Not Assigned</SelectItem>
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
                                <a href={`/dashboard/walk/${walk?.id}`} target="_blank">
                                    <Edit className="cursor-pointer hover:text-blue-500" />
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
