import { useAddPrice } from "../../../api/hooks/usePricing";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Input } from "../../../components/ui/input";
import { TablesInsert } from "../../../utils/database.types";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type AddPriceFormProps = {
    setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
    service_type: z.string(),
    credit_cost: z.number().min(0),
    duration_minutes: z.number().min(0),
    description: z.string(),
    is_discounted: z.boolean(),
    is_active: z.boolean(),
});

export const AddPriceForm = ({ setShowAddForm }: AddPriceFormProps) => {
    const addPriceMutation = useAddPrice();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            service_type: 'walk',
            credit_cost: 0,
            duration_minutes: 0,
            description: '',
            is_discounted: false,
            is_active: true,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await addPriceMutation.mutateAsync(values as TablesInsert<'service_prices'>);
        setShowAddForm(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Price</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="credit_cost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credit Cost</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="duration_minutes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (minutes)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="is_discounted"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Is Discounted</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Is Active</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                        <Button type="submit">Add Price</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
