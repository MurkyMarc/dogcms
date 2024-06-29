import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

type ConfirmationDialogProps = {
    onConfirm: () => void;
    onCancel: () => void;
    text?: string;
    isOpen: boolean;
    title?: string;
}

export const ConfirmationDialog = ({ text = "Are you sure?", onConfirm, onCancel, isOpen, title = "Confirmation" }: ConfirmationDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent>
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
