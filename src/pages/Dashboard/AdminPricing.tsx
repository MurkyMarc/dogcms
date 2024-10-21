import { useEffect, useState } from 'react';
import { useProfile } from '../../api/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tables } from '../../utils/database.types';
import useSupabase from '../../api/hooks/useSupabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { MenuButton } from './components/MenuButton';

export default function AdminPricing() {
    const navigate = useNavigate();
    const supabase = useSupabase();
    const { data: profile, isFetched: isProfileFetched } = useProfile();
    const [prices, setPrices] = useState<Tables<'service_prices'>[]>([]);

    useEffect(() => {
        if (isProfileFetched && (!profile || profile.role !== 'admin')) {
            navigate('/dashboard');
        }
    }, [profile, isProfileFetched, navigate]);

    useEffect(() => {
        const fetchPrices = async () => {
            const { data, error } = await supabase
                .from('service_prices')
                .select('*')
                .order('service_type', { ascending: true });

            if (error) {
                console.error('Error fetching prices:', error);
            } else {
                setPrices(data);
            }
        };

        fetchPrices();
    }, [supabase]);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center">
                <MenuButton className="mr-4" />
                <h1 className="font-semibold text-lg md:text-2xl">Service Pricing</h1>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Credit Cost</TableHead>
                        <TableHead>Duration (minutes)</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Discounted</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {prices.map((price) => (
                        <TableRow key={price.id}>
                            <TableCell>{price.service_type}</TableCell>
                            <TableCell>{price.credit_cost}</TableCell>
                            <TableCell>{price.duration_minutes}</TableCell>
                            <TableCell>{price.description}</TableCell>
                            <TableCell>{price.is_discounted ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{price.is_active ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main>
    );
}