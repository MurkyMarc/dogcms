import useSupabase from "./useSupabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/gotrue-js/src/lib/types"
import { signInWithOTP, signOut, getSession } from "../queries/authQueries";

const queryKey = ['session'];
export function useSignInWithOTP(email: string) {
    const client = useSupabase();

    const queryFn = async () => {
        return signInWithOTP(client, email).then(
            (result) => result.data.session
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useGetSession() {
    const client = useSupabase();

    const queryFn = async () => {
        const { data: { session }, error } = await getSession(client);
        return [session, error]
    };

    return useQuery({ queryKey, queryFn });
}

export function useSignOut() {
    const client = useSupabase();
    const queryClient = useQueryClient();
    queryClient.clear();
    return signOut(client);
}

export function useSetSession(session: Session) {
    const queryClient = useQueryClient();
    queryClient.setQueryData(queryKey, session);
}