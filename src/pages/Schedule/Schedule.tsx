import "@bitnoi.se/react-scheduler/dist/style.css";
import { Scheduler, SchedulerProjectData } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import { useEffect, useState, useCallback, useMemo, SetStateAction } from "react";
import isBetween from 'dayjs/plugin/isBetween';
import { useGetEmployeeWalksInMonth } from "../../api/hooks/useWalks";
import { useGetEmployees } from "../../api/hooks/useProfile";
import { calculateName, getMonthsInRange, idToRgbColor } from "../../utils/helpers";
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

    const fetchAvatars = useCallback(async () => {
        if (!employees || Object.keys(employeeAvatars).length) return;

        const avatarEntries = await Promise.all(
            employees.map(async (employee) => {
                const { url } = await getProfileAvatarUrl(supabase, employee.image);
                return [employee.id, url || ""];
            })
        );

        const avatars = Object.fromEntries(avatarEntries);
        setEmployeeAvatars(avatars);

    }, [employees, supabase, employeeAvatars]);

    useEffect(() => {
        fetchAvatars();
    }, [fetchAvatars]);

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

        // Group walks by walker ID or 'Not Assigned'
        const groupedWalks = combinedWalks.reduce<Record<string, SchedulerProjectData[]>>((acc, walk) => {
            const key = walk?.walker?.id || 'Not Assigned';
            if (!acc[key]) acc[key] = [];

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

        // Ensure every employee is visible, even if they have no walks
        employees.forEach(employee => {
            if (!groupedWalks[employee.id]) groupedWalks[employee.id] = [];
        });

        const schedulerData = Object.entries(groupedWalks).map(([walkerId, walksData]) => ({
            id: walkerId,
            label: {
                icon: employeeAvatars[walkerId] || "",
                title: walkerId = calculateName(employeesMap[walkerId]?.f_name, employeesMap[walkerId]?.l_name) || 'Not Assigned',
                subtitle: ""
            },
            data: walksData
        }));

        // Ensure 'Not Assigned' is always first
        schedulerData.sort(a => a.id === 'Not Assigned' ? -1 : 0);

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