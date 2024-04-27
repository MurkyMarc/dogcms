import useSupabase from "./useSupabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfileById } from "../queries/profileQueries";
import { Session } from "@supabase/supabase-js";

export function AuthStateListener() {
    const supabase = useSupabase();
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            queryClient.setQueryData(['session'], session);
            const { data: profile } = await getProfileById(supabase, session?.user.id || "");
            queryClient.setQueryData(['myprofile'], profile);
        };

        fetchInitialSession();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            queryClient.setQueryData(['session'], session);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, queryClient, supabase]);

    return null;
}

export function useSession() {
    return useQuery<Session, Error>({ queryKey: ['session'] });
}

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

// TODO - when someone updates their profile - revalidate session