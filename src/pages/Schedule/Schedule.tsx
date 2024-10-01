import "@bitnoi.se/react-scheduler/dist/style.css";
import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import { useState, useCallback, SetStateAction } from "react";
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween);

export default function Component() {
    const [filterButtonState, setFilterButtonState] = useState(0);

    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    });

    const handleRangeChange = useCallback((range: SetStateAction<{ startDate: Date; endDate: Date; }>) => {
        setRange(range);
    }, []);

    // Filtering events that are included in current date range
    // Example can be also found on video https://youtu.be/9oy4rTVEfBQ?t=118&si=52BGKSIYz6bTZ7fx
    // and in the react-scheduler repo App.tsx file https://github.com/Bitnoise/react-scheduler/blob/master/src/App.tsx
    const filteredMockedSchedulerData = mockedSchedulerData.map((person) => ({
        ...person,
        data: person.data.filter(
            (project) =>
                // we use "dayjs" for date calculations, but feel free to use library of your choice
                dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
                dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
                (dayjs(project.startDate).isBefore(range.startDate, "day") &&
                    dayjs(project.endDate).isAfter(range.endDate, "day"))
        )
    }))

    return (
        <section>
            <Scheduler
                data={filteredMockedSchedulerData}
                isLoading={false}
                onRangeChange={handleRangeChange}
                onTileClick={(clickedResource) => console.log(clickedResource)}
                onItemClick={(item) => console.log(item)}
                onFilterData={() => {
                    // Some filtering logic...
                    setFilterButtonState(1);
                }}
                onClearFilterData={() => {
                    // Some clearing filters logic...
                    setFilterButtonState(0)
                }}
                config={{
                    zoom: 0,
                    filterButtonState,
                    showTooltip: false
                }}
            />
        </section>
    );
}

const mockedSchedulerData: SchedulerData = [
    {
        id: "1",
        label: {
            icon: "https://picsum.photos/24",
            title: "Joe Doe",
            subtitle: "Dog Walker"
        },
        data: [
            {
                id: "101",
                startDate: new Date("2024-09-30T08:00:00Z"),
                endDate: new Date("2024-09-30T08:30:00Z"),
                occupancy: 1800,
                title: "Dog Walk - Park",
                subtitle: "Morning Walk",
                description: "Walking the dog in the park.",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "102",
                startDate: new Date("2024-09-30T12:00:00Z"),
                endDate: new Date("2024-09-30T12:45:00Z"),
                occupancy: 2700,
                title: "Dog Walk - Neighborhood",
                subtitle: "Midday Walk",
                description: "Walking the dog around the neighborhood.",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "103",
                startDate: new Date("2024-09-30T17:00:00Z"),
                endDate: new Date("2024-09-30T17:30:00Z"),
                occupancy: 1800,
                title: "Dog Walk - Woods",
                subtitle: "Evening Walk",
                description: "Walking the dog in the woods.",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "104",
                startDate: new Date("2024-10-01T09:00:00Z"),
                endDate: new Date("2024-10-01T09:30:00Z"),
                occupancy: 1800,
                title: "Dog Walk - Beach",
                subtitle: "Morning Walk",
                description: "Walking the dog on the beach.",
                bgColor: "rgb(254,165,177)"
            }
        ]
    },
    {
        id: "2",
        label: {
            icon: "https://picsum.photos/24",
            title: "John Smith",
            subtitle: "Dog Walker"
        },
        data: [
            {
                id: "201",
                startDate: new Date("2024-10-01T08:30:00Z"),
                endDate: new Date("2024-10-01T09:00:00Z"),
                occupancy: 1800,
                title: "Dog Walk - City Park",
                subtitle: "Morning Walk",
                description: "Walking the dog in the city park.",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "202",
                startDate: new Date("2024-10-01T12:30:00Z"),
                endDate: new Date("2024-10-01T13:15:00Z"),
                occupancy: 2700,
                title: "Dog Walk - Riverside",
                subtitle: "Midday Walk",
                description: "Walking the dog by the river.",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "203",
                startDate: new Date("2024-10-01T18:00:00Z"),
                endDate: new Date("2024-10-01T18:30:00Z"),
                occupancy: 1800,
                title: "Dog Walk - Countryside",
                subtitle: "Evening Walk",
                description: "Walking the dog in the countryside.",
                bgColor: "rgb(254,165,177)"
            },
            {
                id: "204",
                startDate: new Date("2024-10-02T08:00:00Z"),
                endDate: new Date("2024-10-02T08:30:00Z"),
                occupancy: 1800,
                title: "Dog Walk - Park",
                subtitle: "Morning Walk",
                description: "Walking the dog in the park.",
                bgColor: "rgb(254,165,177)"
            }
        ]
    },
    {
        id: "3",
        label: {
            icon: "https://picsum.photos/24",
            title: "Sara Evans",
            subtitle: "Dog Walker"
        },
        data: [
            {
                id: "301",
                startDate: new Date("2024-10-03T07:00:00Z"),
                endDate: new Date("2024-10-03T07:30:00Z"),
                occupancy: 1800,
                title: "Dog Walk - Forest Trail",
                subtitle: "Morning Walk",
                description: "Walking the dog on the forest trail.",
                bgColor: "rgb(154,205,50)"
            },
            {
                id: "302",
                startDate: new Date("2024-10-03T14:00:00Z"),
                endDate: new Date("2024-10-03T14:45:00Z"),
                occupancy: 2700,
                title: "Dog Walk - Riverbank",
                subtitle: "Afternoon Walk",
                description: "Walking the dog along the riverbank.",
                bgColor: "rgb(123,104,238)"
            }
        ]
    },
    {
        id: "4",
        label: {
            icon: "https://picsum.photos/24",
            title: "Mark Turner",
            subtitle: "Dog Walker"
        },
        data: [
            {
                id: "401",
                startDate: new Date("2024-10-04T09:00:00Z"),
                endDate: new Date("2024-10-04T09:30:00Z"),
                occupancy: 1800,
                title: "Dog Walk - Neighborhood",
                subtitle: "Morning Walk",
                description: "Walking the dog around the neighborhood.",
                bgColor: "rgb(255,99,71)"
            },
            {
                id: "402",
                startDate: new Date("2024-10-04T17:30:00Z"),
                endDate: new Date("2024-10-04T18:00:00Z"),
                occupancy: 1800,
                title: "Dog Walk - Beach",
                subtitle: "Evening Walk",
                description: "Walking the dog on the beach.",
                bgColor: "rgb(72,209,204)"
            }
        ]
    },
    {
        id: "5",
        label: {
            icon: "https://picsum.photos/24",
            title: "Laura Baker",
            subtitle: "Dog Walker"
        },
        data: [
            {
                id: "501",
                startDate: new Date("2024-10-05T10:00:00Z"),
                endDate: new Date("2024-10-05T10:45:00Z"),
                occupancy: 2700,
                title: "Dog Walk - City Park",
                subtitle: "Morning Walk",
                description: "Walking the dog in the city park.",
                bgColor: "rgb(255,127,80)"
            }
        ]
    },
    {
        id: "6",
        label: {
            icon: "https://picsum.photos/24",
            title: "Sarah Johnson",
            subtitle: "Dog Walker"
        },
        data: [
            {
                id: "601",
                startDate: new Date("2024-10-06T14:00:00Z"),
                endDate: new Date("2024-10-06T14:30:00Z"),
                occupancy: 1800,
                title: "Dog Walk - River Trail",
                subtitle: "Afternoon Walk",
                description: "Walking the dog along the river trail.",
                bgColor: "rgb(135,206,250)"
            },
            {
                id: "602",
                startDate: new Date("2024-10-07T11:00:00Z"),
                endDate: new Date("2024-10-07T11:45:00Z"),
                occupancy: 2700,
                title: "Dog Walk - Mountain Path",
                subtitle: "Morning Adventure",
                description: "Taking the dog for a hike on the mountain path.",
                bgColor: "rgb(144,238,144)"
            }
        ]
    }
]