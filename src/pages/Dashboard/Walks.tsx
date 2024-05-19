import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header"
import { useNavigate } from "react-router-dom";
import WalkTable from "./components/WalkTable";
import { Button } from "../../components/ui/button"
import { Tables } from "../../utils/database.types";
import { useSession } from "../../api/hooks/useAuth";
import { useGetDogsByOwner } from "../../api/hooks/useDog";
import { useGetMyProfileById } from "../../api/hooks/useProfile";
import { useGetWalksByCustomerIdAndDateRange } from "../../api/hooks/useWalks";
import { getDateInNumWeeks, getFormattedYMDDate, showDateRange } from "../../utils/helpers";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export default function Walks() {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const [numWeeks, setNumWeeks] = useState(1);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [walksArray, setWalksArray] = useState<Tables<'walks_with_dogs'>[]>([]);
    const { data: dogs } = useGetDogsByOwner(session?.user.id || "");
    const { data: profile } = useGetMyProfileById(session?.user.id || "", !!session);
    const { data: walks, isLoading, error } = useGetWalksByCustomerIdAndDateRange(
        profile?.id || "", getFormattedYMDDate(startDate),
        getFormattedYMDDate(getDateInNumWeeks({ date: startDate, weeks: numWeeks })),
        "week"
    );

    const hasDogs = dogs && dogs.length > 0;

    function combineWalks(array1: Tables<'walks_with_dogs'>[], array2: Tables<'walks_with_dogs'>[]) {
        const map = new Map();
        array1.forEach(item => map.set(item.id, item));
        array2.forEach(item => map.set(item.id, item));
        return Array.from(map.values());
    }

    const handleLoadMore = () => {
        setNumWeeks(numWeeks => numWeeks + 1);
        setStartDate(getDateInNumWeeks({ weeks: numWeeks }));
    }

    useEffect(() => {
        if (walks) setWalksArray(items => combineWalks(items, walks));
    }, [walks]);

    const walkTable = useMemo(() => {
        <WalkTable isLoading={isLoading} error={error} walks={walksArray} />
    }, [walksArray, isLoading, error]);

    return (
        <>
            <Header title="Walks" showSearch={hasDogs} />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                {hasDogs ?
                    <>
                        <div className="flex items-center">
                            <h1 className="font-semibold text-lg md:text-2xl">Upcoming Walks</h1>
                            <h2 className="hidden sm:block text-lg ml-4 py-1 px-2 bg-accent rounded-md">{showDateRange(new Date(), getDateInNumWeeks({ date: startDate, weeks: numWeeks }))}</h2>
                            {isLoading && <LoadingSpinner className="ml-2" />}
                            <Button className="ml-auto" size="sm" disabled={!hasDogs} onClick={() => navigate("/dashboard/walks/new")}>
                                Schedule new walk
                            </Button>
                        </div>
                        {walkTable}
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
                <Button className="w-full" onClick={handleLoadMore}>Load more</Button>
            </main>
        </>
    )
}