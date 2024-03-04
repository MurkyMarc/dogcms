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

export const ProfilePaymentInfo = ({ isUpdating, isLoading, profile }: props) => {
    const updateProfileQuery = useUpdateProfile();
    const [name, setName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [street, setStreet] = useState("");
    const [unit, setUnit] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    async function updateProfileInfo(event: FormEvent<Element>) {
        event.preventDefault();
        const updates = { cardNumber, expiry, cvv, updated_at: new Date().toISOString() };

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
                <div className="my-8">Enter your information. We accept Visa, Discover, Mastercard, etc.</div>
                <div className="grid grid-cols-1 gap-4 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your card number" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="Enter your card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="Enter CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="street">Street</Label>
                        <Input id="street" placeholder="Enter the address" value={street} onChange={(e) => setStreet(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unit">Unit Number</Label>
                        <Input id="unit" placeholder="Enter the unit number (optional)" value={unit} onChange={(e) => setUnit(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Enter the City" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="Enter the State" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zip">Zipcode</Label>
                        <Input id="zip" placeholder="Enter the zipcode" value={zip} onChange={(e) => setZip(e.target.value)} />
                    </div>
                </div>
            </div>
            <CardFooter className="px-0">
                <Button type={"submit"} disabled={isUpdating || isLoading}>Save</Button>
            </CardFooter>
        </form>
    )
}

