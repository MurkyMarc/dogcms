import { SchedulerProjectData } from "@bitnoi.se/react-scheduler";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "../../../components/ui/dialog";

interface WalkInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    walkInfo: SchedulerProjectData | null;
}

export const WalkInfoModal: React.FC<WalkInfoModalProps> = ({ isOpen, onClose, walkInfo }) => {
    if (!walkInfo) return null;
    const startTime = walkInfo.startDate.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });
    const endTime = walkInfo.endDate.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/50" />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{walkInfo.title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p><strong>Date:</strong> {walkInfo.startDate.getMonth() + 1}/{walkInfo.startDate.getDate()}/{walkInfo.startDate.getFullYear()}</p>
                    <p><strong>Time:</strong> {startTime} - {endTime}</p>
                    <p><strong>Description:</strong> {walkInfo.description}</p>
                </div>
                <Button onClick={onClose}>Close</Button>
            </DialogContent>
        </Dialog>
    );
};