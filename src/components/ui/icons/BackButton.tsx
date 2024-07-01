import { useNavigate } from 'react-router-dom';
import { Button } from '../button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { cn } from '../../../utils/cn';

const BackButton = ({ text, className }: { text?: string, className?: string }) => {
    const navigate = useNavigate();

    return (
        <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className={cn("items-center gap-2 rounded-md px-4 py-6 text-sm font-medium transition-colors hover:bg-muted", className)}
        >
            <ArrowLeftIcon className="h-4 w-4" />
            {text}
        </Button>
    );
};

export default BackButton;
