import "@bitnoi.se/react-scheduler/dist/style.css";
import { Scheduler, SchedulerProjectData } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import { useEffect, useState, useCallback, useMemo, SetStateAction } from "react";
import isBetween from 'dayjs/plugin/isBetween';
import { useGetEmployeeWalksInMonth } from "../../api/hooks/useWalks";
import { useGetEmployees } from "../../api/hooks/useProfile";
import { getMonthsInRange, idToRgbColor } from "../../utils/helpers";
import { Tables } from "../../utils/database.types";
import { getProfileAvatarUrl } from "../../api/queries/profileQueries";
import useSupabase from "../../api/hooks/useSupabase";
import { WalkInfoModal } from "./components/WalkInfoModal";

dayjs.extend(isBetween);

export default function Schedule() {
    const supabase = useSupabase();
    const [range, setRange] = useState({ startDate: new Date(), endDate: new Date() });
    const [employeeAvatars, setEmployeeAvatars] = useState<Record<string, string>>({});
    const [selectedWalk, setSelectedWalk] = useState<SchedulerProjectData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: employees, isLoading: isLoadingEmployees } = useGetEmployees();

    // Generate all the months in the range
    const monthsToFetch = useMemo(() => getMonthsInRange(range.startDate, range.endDate), [range.startDate, range.endDate]);

    // Use cached fetches by month for all months in the range
    const { data: walksByMonth, isLoading: isLoadingWalks } = useGetEmployeeWalksInMonth(monthsToFetch);

    useEffect(() => {
        if (employees && Object.keys(employeeAvatars).length === 0) {
            const fetchAvatars = async () => {
                const avatars: Record<string, string> = {};
                for (const employee of employees) {
                    const { url } = await getProfileAvatarUrl(supabase, employee.image);
                    avatars[employee.id] = url || "";
                }
                setEmployeeAvatars(avatars);
            };
            fetchAvatars();
        }
    }, [employees, supabase, employeeAvatars]);

    const handleRangeChange = useCallback((newRange: SetStateAction<{ startDate: Date; endDate: Date; }>) => {
        setRange(newRange);
    }, []);

    const schedulerData = useMemo(() => {
        if (!employees || !walksByMonth) return [];

        // Combine walks from all fetched months
        const combinedWalks = walksByMonth.flat();

        // Create a map of employee IDs to employee names
        const employeesMap = employees.reduce<Record<string, Partial<Tables<'profiles'>>>>((acc, employee) => {
            acc[employee.id] = employee;
            return acc;
        }, {});

        // Group walks by walker ID or "notAssigned"
        const groupedWalks = combinedWalks.reduce<Record<string, SchedulerProjectData[]>>((acc, walk) => {
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
                bgColor: idToRgbColor(walk.id)
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
                icon: employeeAvatars[walkerId] || "",
                title: walkerId === 'notAssigned' ? "Not Assigned" : `${employeesMap[walkerId]?.f_name} ${employeesMap[walkerId]?.l_name}` || "Unknown",
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
    }, [employees, walksByMonth, employeeAvatars]);

    return (
        <section>
            <Scheduler
                data={schedulerData}
                isLoading={isLoadingEmployees || isLoadingWalks}
                onRangeChange={handleRangeChange}
                onTileClick={(item) => {
                    console.log(item);
                    setSelectedWalk(item);
                    setIsModalOpen(true);
                }}
                onItemClick={(item) => console.log(item)}
                config={{
                    zoom: 1,
                    showTooltip: false,
                    filterButtonState: -1
                }}
            />
            <WalkInfoModal
                key={selectedWalk?.id}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                walkInfo={selectedWalk}
            />
        </section>
    );
}
