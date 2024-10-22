import { useEffect, useState } from 'react';
import { useProfile } from '../../api/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Tables, TablesInsert } from '../../utils/database.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { MenuButton } from './components/MenuButton';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { useGetPrices, useUpdatePrice, useAddPrice } from '../../api/hooks/usePricing';
import { Edit, Save, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Trash2 } from "lucide-react";
import { ConfirmationDialog } from "../../components/ConfirmationDialogue";

const AddPriceForm = () => {
    const addPriceMutation = useAddPrice();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPrice, setNewPrice] = useState<TablesInsert<'service_prices'>>({
        service_type: '',
        credit_cost: 0,
        duration_minutes: 0,
        description: '',
        is_discounted: false,
        is_active: true,
    });

    const handleChange = (field: keyof Tables<'service_prices'>, value: string | number | boolean) => {
        setNewPrice(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addPriceMutation.mutateAsync(newPrice as TablesInsert<'service_prices'>);
        setShowAddForm(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
                placeholder="Service Type"
                value={newPrice.service_type}
                onChange={(e) => handleChange('service_type', e.target.value)}
            />
            <Input
                type="number"
                placeholder="Credit Cost"
                value={newPrice.credit_cost}
                onChange={(e) => handleChange('credit_cost', Number(e.target.value))}
            />
            <Input
                type="number"
                placeholder="Duration (minutes)"
                value={newPrice.duration_minutes}
                onChange={(e) => handleChange('duration_minutes', Number(e.target.value))}
            />
            <Input
                placeholder="Description"
                value={newPrice.description}
                onChange={(e) => handleChange('description', e.target.value)}
            />
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_discounted"
                    checked={newPrice.is_discounted}
                    onCheckedChange={(checked) => handleChange('is_discounted', checked)}
                />
                <label htmlFor="is_discounted">Is Discounted</label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_active"
                    checked={newPrice.is_active}
                    onCheckedChange={(checked) => handleChange('is_active', checked)}
                />
                <label htmlFor="is_active">Is Active</label>
            </div>
            <Button type="submit">Add Price</Button>
            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
        </form>
    );
};

export default function AdminPricing() {
    const navigate = useNavigate();
    const updatePriceMutation = useUpdatePrice();
    const { data: profile, isFetched: isProfileFetched } = useProfile();
    const [servicePrices, setServicePrices] = useState<Tables<'service_prices'>[]>([]);
    const [editingState, setEditingState] = useState<{
        id: string | null;
        values: Tables<'service_prices'> | null;
    }>({ id: null, values: null });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingPriceId, setDeletingPriceId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (isProfileFetched && (!profile || profile.role !== 'admin')) {
            navigate('/dashboard');
        }
    }, [profile, isProfileFetched, navigate]);

    const { data: pricesData } = useGetPrices();

    useEffect(() => {
        if (pricesData) {
            setServicePrices(pricesData);
        }
    }, [pricesData]);

    const handleEdit = (price: Tables<'service_prices'>) => {
        setEditingState({ id: price.id.toString(), values: { ...price } });
    };

    const handleSave = async () => {
        if (editingState.id && editingState.values) {
            updatePriceMutation.mutate(editingState.values as Tables<'service_prices'>);
            setServicePrices(servicePrices.map(p => p.id.toString() === editingState.id ? { ...p, ...editingState.values } : p));
            setEditingState({ id: null, values: null });
        }
    };

    const handleCancel = () => {
        setEditingState({ id: null, values: null });
    };

    const handleChange = (field: keyof Tables<'service_prices'>, value: string | boolean) => {
        setEditingState(prev => ({
            ...prev,
            values: prev.values ? { ...prev.values, [field]: value } : null
        }));
    };

    const renderCell = (price: Tables<'service_prices'>, field: keyof Tables<'service_prices'>) => {
        if (editingState.id === price.id.toString()) {
            if (typeof price[field] === "boolean") {
                return (
                    <Checkbox
                        checked={editingState.values?.[field] as boolean}
                        onCheckedChange={(checked) => handleChange(field, checked)}
                    />
                );
            } else {
                return (
                    <Input
                        type={field === 'credit_cost' || field === 'duration_minutes' ? 'number' : 'text'}
                        value={editingState.values?.[field] as string}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                );
            }
        } else {
            if (field === 'is_discounted' || field === 'is_active') {
                return price[field] ? 'Yes' : 'No';
            } else {
                return price[field];
            }
        }
    };

    const handleDeleteClick = (priceId: string) => {
        setDeletingPriceId(priceId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (deletingPriceId) {
            // Implement the delete logic here
            console.log(`Deleting price with ID: ${deletingPriceId}`);
            // After deletion logic, update the state
            setServicePrices(servicePrices.filter(p => p.id.toString() !== deletingPriceId));
        }
        setShowDeleteModal(false);
        setDeletingPriceId(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingPriceId(null);
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center">
                <MenuButton className="mr-4" />
                <h1 className="font-semibold text-lg md:text-2xl">Service Pricing</h1>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-min">Service Type</TableHead>
                        <TableHead className="w-min">Credit Cost</TableHead>
                        <TableHead className="w-min">Duration (min)</TableHead>
                        <TableHead className="w-min">Description</TableHead>
                        <TableHead className="w-min">Discounted</TableHead>
                        <TableHead className="w-min">Active</TableHead>
                        <TableHead className="w-min">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {servicePrices.map((price) => (
                        <TableRow key={price.id}>
                            <TableCell className="w-min">{renderCell(price, 'service_type')}</TableCell>
                            <TableCell className="w-min">{renderCell(price, 'credit_cost')}</TableCell>
                            <TableCell className="w-min">{renderCell(price, 'duration_minutes')}</TableCell>
                            <TableCell className="w-min">{renderCell(price, 'description')}</TableCell>
                            <TableCell className="w-min">{renderCell(price, 'is_discounted')}</TableCell>
                            <TableCell className="w-min">{renderCell(price, 'is_active')}</TableCell>
                            <TableCell className="w-min">
                                <TooltipProvider>
                                    {editingState.id === price.id.toString() ? (
                                        <>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button onClick={handleSave} size="icon" variant="ghost">
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Save changes</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button onClick={handleCancel} size="icon" variant="ghost">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Cancel edit</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </>
                                    ) : (
                                        <>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button onClick={() => handleEdit(price)} size="icon" variant="ghost">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit price</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button onClick={() => handleDeleteClick(price.id.toString())} size="icon" variant="ghost">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete price</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </>
                                    )}
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ConfirmationDialog
                title="Delete Price"
                text="Are you sure you want to delete this price? This action cannot be undone."
                isOpen={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <Button onClick={() => setShowAddForm(true)} className="mt-4">
                Add New Price
            </Button>
            {showAddForm && <AddPriceForm />}
        </main>
    );
}
