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

export const ProfileUserInfo = ({ isUpdating, isLoading, profile }: props) => {
    const updateProfileQuery = useUpdateProfile();
    const [firstName, setFirstName] = useState(profile.full_name || "");
    const [lastName, setLastName] = useState(profile.username || "");
    const [phone, setPhone] = useState("");

    async function updateProfileInfo(event: FormEvent<Element>) {
        event.preventDefault();
        const updates = { firstName, lastName, phone, updated_at: new Date().toISOString() };

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
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" readOnly disabled value="example@acme.inc" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                </div>
            </div>
            <CardFooter className="py-4 px-0">
                <Button type={"submit"} disabled={isUpdating || isLoading}>Save</Button>
            </CardFooter>
        </form>
    )
}

