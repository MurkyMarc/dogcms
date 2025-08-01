import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Tables } from "../../../utils/database.types";
import { formatMonthDayFromDateString, formatDateStringToAmPmString } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { DogCircleIcon } from "./DogCircleIcon";

interface WalkTableProps {
    isLoading: boolean;
    error: Error | null;
    walks: Tables<'walks_with_dogs'>[] | undefined;
}

export default function WalkTable({ isLoading, error, walks = [] }: WalkTableProps) {
    const navigate = useNavigate();

    if (walks.length === 0 && isLoading) return <p className="pl-6 pt-6">Loading...</p>;
    if (error) return <p>There was an error loading the upcoming walks. Please try again later.</p>;

    if (!walks || walks.length === 0) {
        return <p>No walks found for these dates.</p>
    }

    return (
        <div>
            {walks.length > 0 ?
                <div className="shadow-sm rounded-lg">
                    <Table>
                        <TableHeader className="sticky top-0 bg-slate-50">
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead className="hidden md:table-cell">Assigned Dogs</TableHead>
                                <TableHead className="hidden md:table-cell">Walker</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white">
                            {walks.map((walk) => (
                                <TableRow key={walk.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/walk/${walk.id}`)}>
                                    <TableCell>{formatMonthDayFromDateString(walk.start)}</TableCell>
                                    <TableCell>{formatDateStringToAmPmString(walk.start) + " - " + formatDateStringToAmPmString(walk.end)}</TableCell>
                                    <TableCell className="hidden md:flex md:flex-row md:py-1">
                                        {(walk.dogs as Array<Tables<'dogs'>>).map((dog) => {
                                            return (
                                                <div key={`${dog.id}`} className="p-1 mx-1">
                                                    <DogCircleIcon dog={dog} />
                                                </div>
                                            )
                                        })}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell capitalize">{walk.walker ? `${walk.walker?.f_name} ${walk.walker?.l_name.charAt(0)}` : "Not assigned"}</TableCell>
                                    <TableCell>{walk.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                : <p className="text-center text-lg py-8">No walks found for these dates.</p>
            }
        </div>
    )
}
