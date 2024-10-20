import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

type ConfirmationDialogProps = {
    onConfirm: () => void;
    onCancel: () => void;
    text?: string;
    isOpen: boolean;
    title?: string;
    overlayStyles?: string;
    containerStyles?: string;
}

export const ConfirmationDialog = ({ text = "Are you sure?", onConfirm, onCancel, isOpen, title = "Confirmation", overlayStyles = "", containerStyles = "" }: ConfirmationDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogOverlay className={cn("bg-black/70 -inset-10", overlayStyles)} />
            <DialogContent className={containerStyles}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {text}
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={onCancel} variant="outline" className="mt-6 sm:mt-0">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="destructive">
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
