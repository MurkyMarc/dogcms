import { useNavigate } from 'react-router-dom';
import { Button } from '../button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const BackButton = ({ text }: { text?: string }) => {
    const navigate = useNavigate();

    return (
        <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
            <ArrowLeftIcon className="h-4 w-4" />
            {text}
        </Button>
    );
};

export default BackButton;
