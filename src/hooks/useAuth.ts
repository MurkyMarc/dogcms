import useSupabase from "./useSupabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useSignInWithOTP() {
    const client = useSupabase();

    const signInWithOTP = async (email: string) => {
        const { data, error } = await client.auth.signInWithOtp({ email });
        return { data, error }
    };

    return signInWithOTP;
}

export function useSignOut() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const client = useSupabase();

    const signOut = async () => {
        await client.auth.signOut();
        queryClient.clear();
        navigate('/');
    };

    return signOut;
}

export function useSession() {
    const supabase = useSupabase();
    const queryClient = useQueryClient();
    const queryKey = ['session'];
    
    const queryFn = async () => {
        const { data } = await supabase.auth.getSession();
        return data.session;
    }
    const { data: session, ...queryInfo } = useQuery({ queryKey, queryFn });

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            queryClient.setQueryData(['session'], session);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, queryClient]);

    return { session, ...queryInfo };
}