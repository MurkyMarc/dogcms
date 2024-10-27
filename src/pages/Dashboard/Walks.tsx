import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WalkTable from "./components/WalkTable";
import { Button } from "../../components/ui/button"
import { useSession } from "../../api/hooks/useAuth";
import { useGetDogsByOwner } from "../../api/hooks/useDog";
import { useGetMyProfileById } from "../../api/hooks/useProfile";
import { useGetWalksByCustomerIdAndMonth } from "../../api/hooks/useWalks";
import { getBeginningOfMonth, getEndOfMonth, showDateRange, getNextMonth, getMonthsInRange } from "../../utils/helpers";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { MenuButton } from "./components/MenuButton";
import { ScrollArea } from "../../components/ui/scroll-area";

export default function Walks() {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const [range, setRange] = useState({ startDate: getBeginningOfMonth(new Date()), endDate: getEndOfMonth(getNextMonth(new Date())) });
    const { data: dogs } = useGetDogsByOwner(session?.user.id || "");
    const { data: profile } = useGetMyProfileById(session?.user.id || "");

    // Generate all the months in the range
    const monthsToFetch = useMemo(() => getMonthsInRange(range.startDate, range.endDate), [range.startDate, range.endDate]);

    // Use cached fetches by month for all months in the range
    const { data: walks, isLoading } = useGetWalksByCustomerIdAndMonth(profile?.id || "", monthsToFetch);

    const hasDogs = (dogs && dogs.length > 0) || false;

    const handleLoadMore = () => {
        setRange(prevRange => ({
            ...prevRange,
            endDate: getEndOfMonth(getNextMonth(prevRange.endDate))
        }));
    }

    const handleLoadPrevious = () => {
        setRange(prevRange => ({
            startDate: getBeginningOfMonth(new Date(prevRange.startDate.getFullYear(), prevRange.startDate.getMonth() - 1, 1)),
            endDate: prevRange.endDate
        }));
    }

    const walkTable = useMemo(() => {
        return <WalkTable isLoading={isLoading} error={null} walks={walks} />
    }, [walks, isLoading]);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            {hasDogs ?
                <>
                    <div className="flex items-center">
                        <MenuButton className="mr-4" />
                        <h1 className="font-semibold text-lg md:text-2xl">Upcoming Walks</h1>
                        <h2 className="hidden sm:block text-lg ml-4 py-1 px-2 bg-accent rounded-md">
                            {showDateRange(range.startDate, range.endDate)}
                        </h2>
                        {isLoading && <LoadingSpinner className="ml-2" />}
                        <Button className="ml-auto" size="sm" disabled={!hasDogs} onClick={() => navigate("/dashboard/walks/new")}>
                            Schedule new walk
                        </Button>
                    </div>
                    <ScrollArea className="h-[calc(100vh-250px)] border rounded-lg bg-gray-50">
                        {walkTable}
                    </ScrollArea>
                </> :
                <div className="text-center lg:text-left">
                    <h1 className="font-semibold text-3xl">No dogs found!</h1>
                    <p className="text-muted-foreground pt-1">
                        You will need to add a dog to your profile before you can schedule walks.
                    </p>
                    <Button className="mt-4" size="sm" onClick={() => navigate("/dashboard/dogs/new")}>
                        Add a new dog
                    </Button>
                </div>
            }
            <div className="flex justify-between w-full">
                <Button className="w-1/2 mr-2" onClick={handleLoadPrevious}>Previous Month</Button>
                <Button className="w-1/2 ml-2" onClick={handleLoadMore}>Next Month</Button>
            </div>
        </main>
    )
}
