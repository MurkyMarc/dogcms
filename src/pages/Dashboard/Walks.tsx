import { Header } from "./components/Header"
import { Button } from "../../components/ui/button"
import { useNavigate } from "react-router-dom";
import { useSession } from "../../api/hooks/useAuth";
import { useGetMyProfileById } from "../../api/hooks/useProfile";
import WalkTable from "./components/WalkTable";
import { useGetDogsByOwner } from "../../api/hooks/useDog";

export default function Walks() {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const { data: profile } = useGetMyProfileById(session?.user.id || "", !!session);
    const { data: dogs } = useGetDogsByOwner(session?.user.id || "");
    const hasDogs = dogs && dogs.length > 0;

    return (
        <>
            <Header title="Walks" showSearch={hasDogs} />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                {hasDogs ?
                    <>
                        <div className="flex items-center">
                            <h1 className="font-semibold text-lg md:text-2xl">Upcoming Walks</h1>
                            <Button className="ml-auto" size="sm" disabled={!hasDogs} onClick={() => navigate("/dashboard/walks/new")}>
                                Schedule new walk
                            </Button>
                        </div>

                        {profile && <WalkTable profile={profile} />}
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
            </main>
        </>
    )
}