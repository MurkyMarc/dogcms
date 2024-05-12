import { useGetWalksByCustomerIdAndDateRange } from "../../../api/hooks/useWalks"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Tables } from "../../../utils/database.types";
import { formatMonthDay, formatTimeToAmPm, getNextWeekDate, getTodaysDate } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { CircleIcon } from "./CircleIcon";

export default function WalkTable({ profile }: { profile: Tables<'profiles'> }) {
    const navigate = useNavigate();
    const date = getTodaysDate();
    const nextWeekDate = getNextWeekDate(new Date(date));
    const { data: walks, isLoading, error } = useGetWalksByCustomerIdAndDateRange(profile.id, date, nextWeekDate, "week");

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>There was an error loading the upcoming walks. Please try again later.</p>;

    if (!walks || walks.length === 0) {
        return <p>No walks found for the next 7 days.</p>
    }

    return (
        <div className="border shadow-sm rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="hidden md:table-cell">Assigned Dogs</TableHead>
                        <TableHead className="hidden md:table-cell">Walker</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {walks.map((walk) => (
                        <TableRow key={walk.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/walks/${walk.id}`)}>
                            <TableCell>{formatMonthDay(walk.date)}</TableCell>
                            <TableCell>{formatTimeToAmPm(walk.start) + " - " + formatTimeToAmPm(walk.end)}</TableCell>
                            <TableCell className="hidden md:flex md:flex-row md:py-1">
                                {(walk.dogs as Array<Tables<'dogs'>>).map((dog) => {
                                    return (
                                        <div key={`${dog.id}`} className="p-1 mx-1">
                                            <CircleIcon dog={dog} imageStyles="rounded-full w-12 h-12" />
                                        </div>
                                    )
                                })}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{walk.walker || "Not assigned"}</TableCell>
                            <TableCell>{walk.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
