import { Header } from "./components/Header"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "../../components/ui/pagination"

export default function Schedules() {
    return (
        <>
            <div className="flex flex-col">
                <Header title="Schedules" showSearch={true} />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <div className="flex items-center">
                        <h1 className="font-semibold text-lg md:text-2xl">Upcoming Walks</h1>
                        <Button className="ml-auto" size="sm">
                            Schedule new walk
                        </Button>
                    </div>
                    <div className="border shadow-sm rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="">Date</TableHead>
                                    <TableHead className="">Time</TableHead>
                                    <TableHead className="hidden md:table-cell">Dog's Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Walker's Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">2022-04-01</TableCell>
                                    <TableCell>10:00 AM</TableCell>
                                    <TableCell className="hidden md:table-cell">Bailey</TableCell>
                                    <TableCell className="hidden md:table-cell">Emma Thompson</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">2022-04-02</TableCell>
                                    <TableCell>11:30 AM</TableCell>
                                    <TableCell className="hidden md:table-cell">Max</TableCell>
                                    <TableCell className="hidden md:table-cell">Oliver Smith</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">2022-04-03</TableCell>
                                    <TableCell>09:45 AM</TableCell>
                                    <TableCell className="hidden md:table-cell">Luna</TableCell>
                                    <TableCell className="hidden md:table-cell">Chloe Wilson</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">2022-04-04</TableCell>
                                    <TableCell>01:15 PM</TableCell>
                                    <TableCell className="hidden md:table-cell">Rocky</TableCell>
                                    <TableCell className="hidden md:table-cell">Jack Brown</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">2022-04-05</TableCell>
                                    <TableCell>03:30 PM</TableCell>
                                    <TableCell className="hidden md:table-cell">Daisy</TableCell>
                                    <TableCell className="hidden md:table-cell">Mia Johnson</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center mt-8">
                        <h1 className="font-semibold text-lg md:text-2xl">Recurring Walks</h1>
                    </div>
                    <div className="border shadow-sm rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="">Day(s)</TableHead>
                                    <TableHead className="">Time</TableHead>
                                    <TableHead className="hidden md:table-cell">Dog's Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Walker's Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Mon, Wed, Fri</TableCell>
                                    <TableCell>10:00 AM</TableCell>
                                    <TableCell className="hidden md:table-cell">Bailey</TableCell>
                                    <TableCell className="hidden md:table-cell">Emma Thompson</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Tue, Thu</TableCell>
                                    <TableCell>11:30 AM</TableCell>
                                    <TableCell className="hidden md:table-cell">Max</TableCell>
                                    <TableCell className="hidden md:table-cell">Oliver Smith</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Mon - Fri</TableCell>
                                    <TableCell>09:45 AM</TableCell>
                                    <TableCell className="hidden md:table-cell">Luna</TableCell>
                                    <TableCell className="hidden md:table-cell">Chloe Wilson</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Sat, Sun</TableCell>
                                    <TableCell>01:15 PM</TableCell>
                                    <TableCell className="hidden md:table-cell">Rocky</TableCell>
                                    <TableCell className="hidden md:table-cell">Jack Brown</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Mon - Fri</TableCell>
                                    <TableCell>03:30 PM</TableCell>
                                    <TableCell className="hidden md:table-cell">Daisy</TableCell>
                                    <TableCell className="hidden md:table-cell">Mia Johnson</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        2
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">3</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </main>
            </div>
        </>
    )
}