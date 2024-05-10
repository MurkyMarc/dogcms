import { useGetWalksByCustomerIdAndDateRange } from "../../../api/hooks/useWalks"
import { TableBody, TableCell, TableRow } from "../../../components/ui/table"
import { Tables } from "../../../utils/database.types";
import { getNextWeekDate, getTodaysDate } from "../../../utils/helpers";

export default function WalkTableBody({ profile }: { profile: Tables<'profiles'> }) {
    const date = getTodaysDate();
    const nextWeekDate = getNextWeekDate(new Date(date));
    const walks = useGetWalksByCustomerIdAndDateRange(profile.id, date, nextWeekDate, "week");

    return (
        <TableBody>
            {walks.data?.map((walk) => (
                <TableRow key={walk.id}>
                    <TableCell className="font-medium">{walk.date}</TableCell>
                    <TableCell>{walk.start}</TableCell>
                    <TableCell className="hidden md:table-cell">{walk.customer}</TableCell>
                    <TableCell className="hidden md:table-cell">{walk.walker || "Not assigned"}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}