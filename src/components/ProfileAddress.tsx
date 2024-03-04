import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { useState, FormEvent } from 'react'
import { Button } from "./ui/button"
import { CardFooter } from "./ui/card"
import { Tables } from "../utils/database.types"
import { useUpdateProfile } from '../hooks/useProfile'

type props = {
    isUpdating: boolean;
    isLoading: boolean;
    profile: Tables<'profiles'>
}

export const ProfileAddress = ({ isUpdating, isLoading, profile }: props) => {
    const updateProfileQuery = useUpdateProfile();
    const [street, setStreet] = useState(profile.full_name || "");
    const [unit, setUnit] = useState("");
    const [city, setCity] = useState(profile.username || "");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    async function updateProfileInfo(event: FormEvent<Element>) {
        event.preventDefault();
        const updates = { street, unit, city, state, zip, updated_at: new Date().toISOString() };

        try {
            // updateProfileQuery.mutate({ id: profile.id, data: updates });
            console.log(updates);
        } catch (error) {
            alert(error); // Todo - toast
        }
    }

    return (
        <form onSubmit={(e) => updateProfileInfo(e)} className="space-y-4">
            <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" placeholder="Enter your street address" value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unit">Unit Number</Label>
                        <Input id="unit" placeholder="Enter your unit number" value={unit} onChange={(e) => setUnit(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Enter your city" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="Enter your state" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zip">Zip Code</Label>
                        <Input id="zip" placeholder="Enter your zip code" value={zip} onChange={(e) => setZip(e.target.value)} />
                    </div>
                </div>
            </div>
            <CardFooter className="py-4 px-0">
                <Button type={"submit"} disabled={isUpdating || isLoading}>Save</Button>
            </CardFooter>
        </form>
    )
}

