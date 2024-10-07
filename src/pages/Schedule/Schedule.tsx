import "@bitnoi.se/react-scheduler/dist/style.css";
import { Scheduler } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import { useState, useCallback, useMemo, SetStateAction } from "react";
import isBetween from 'dayjs/plugin/isBetween';
import { useGetEmployeeWalksInMonth } from "../../api/hooks/useWalks";
import { useGetEmployees } from "../../api/hooks/useProfile";

dayjs.extend(isBetween);

type SchedulerDataItem = {
    id: string,
    startDate: Date,
    endDate: Date,
    occupancy: number,
    title: string,
    subtitle: string,
    description: string,
    bgColor: string
};

// Utility function to generate all months between two dates
const getMonthsInRange = (startDate: Date, endDate: Date): string[] => {
    const start = dayjs(startDate).startOf('month');
    const end = dayjs(endDate).endOf('month');
    const months = [];

    let current = start;
    while (current.isBefore(end) || current.isSame(end)) {
        months.push(current.format('YYYY-MM'));
        current = current.add(1, 'month');
    }

    return months;
};

export default function Component() {
    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const { data: employees, isLoading: isLoadingEmployees } = useGetEmployees();

    // Generate all the months in the range
    const monthsToFetch = useMemo(() => getMonthsInRange(range.startDate, range.endDate), [range.startDate, range.endDate]);

    // Use cached fetches by month for all months in the range
    const { data: walksByMonth, isLoading: isLoadingWalks } = useGetEmployeeWalksInMonth(monthsToFetch);

    const handleRangeChange = useCallback((newRange: SetStateAction<{ startDate: Date; endDate: Date; }>) => {
        setRange(newRange);
    }, []);

    const schedulerData = useMemo(() => {
        if (!employees || !walksByMonth) return [];

        // Combine walks from all fetched months
        const combinedWalks = walksByMonth.flat();

        // Create a map of employee IDs to employee names
        const employeesMap = employees.reduce<Record<string, string>>((acc, employee) => {
            acc[employee.id] = `${employee.f_name} ${employee.l_name}`;
            return acc;
        }, {});

        // Group walks by walker ID or "notAssigned"
        const groupedWalks = combinedWalks.reduce<Record<string, SchedulerDataItem[]>>((acc, walk) => {
            const key = walk.walker || 'notAssigned';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push({
                id: walk.id.toString(),
                startDate: new Date(walk.start),
                endDate: new Date(walk.end),
                occupancy: 0,
                title: walk.title,
                subtitle: walk.subtitle,
                description: walk.description,
                bgColor: "rgb(254,165,177)"
            });
            return acc;
        }, {});

        // Ensure every employee is represented, even if they have no walks
        employees.forEach(employee => {
            if (!groupedWalks[employee.id]) {
                groupedWalks[employee.id] = [];
            }
        });

        // Build the scheduler data
        const schedulerData = Object.entries(groupedWalks).map(([walkerId, walksData]) => ({
            id: walkerId,
            label: {
                icon: "",
                title: walkerId === 'notAssigned' ? "Not Assigned" : employeesMap[walkerId] || "Unknown",
                subtitle: ""
            },
            data: walksData
        }));

        // Ensure "Not Assigned" is always first
        const notAssignedIndex = schedulerData.findIndex(item => item.id === 'notAssigned');
        if (notAssignedIndex > 0) {
            const [notAssigned] = schedulerData.splice(notAssignedIndex, 1);
            schedulerData.unshift(notAssigned);
        }

        return schedulerData;
    }, [employees, walksByMonth]);

    return (
        <section>
            <Scheduler
                data={schedulerData}
                isLoading={isLoadingEmployees || isLoadingWalks}
                onRangeChange={handleRangeChange}
                onTileClick={(clickedResource) => console.log(clickedResource)}
                onItemClick={(item) => console.log(item)}
                config={{
                    zoom: 1,
                    showTooltip: false,
                    filterButtonState: -1
                }}
            />
        </section>
    );
}
