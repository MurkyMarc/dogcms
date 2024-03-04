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

export const ProfileEmergencyContacts = ({ isUpdating, isLoading, profile }: props) => {
    const updateProfileQuery = useUpdateProfile();
    const [contact1Name, setContact1Name] = useState(profile.full_name || "");
    const [contact1Phone, setContact1Phone] = useState("");
    const [contact2Name, setContact2Name] = useState("");
    const [contact2Phone, setContact2Phone] = useState("");

    async function updateProfileInfo(event: FormEvent<Element>) {
        event.preventDefault();
        const updates = { contact1Name, contact1Phone, contact2Name, contact2Phone, updated_at: new Date().toISOString() };

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
                        <Label htmlFor="contact1name">Emergency Contact 1 Name</Label>
                        <Input id="contact1name" placeholder="Name" value={contact1Name} onChange={(e) => setContact1Name(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact1phone">Emergency Contact 1 Phone</Label>
                        <Input id="contact1phone" placeholder="Phone" value={contact1Phone} onChange={(e) => setContact1Phone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact2name">Emergency Contact 2 Name</Label>
                        <Input id="contact2name" placeholder="Name" value={contact2Name} onChange={(e) => setContact2Name(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact2phone">Emergency Contact 2 Phone</Label>
                        <Input id="contact2phone" placeholder="Phone" value={contact2Phone} onChange={(e) => setContact2Phone(e.target.value)} />
                    </div>
                </div>
            </div>
            <CardFooter className="py-4 px-0">
                <Button type={"submit"} disabled={isUpdating || isLoading}>Save</Button>
            </CardFooter>
        </form>
    )
}

