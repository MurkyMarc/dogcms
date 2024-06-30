import { useState } from 'react'
import { useSignInWithOTP } from '../../../api/hooks/useAuth';
import { errorToast } from '../../../utils/helpers';

export const SignUpContainer = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const signInWithOTP = useSignInWithOTP();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true);
        const { error } = await signInWithOTP(email);

        if (error) {
            errorToast("Something went wrong");
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    }

    return (
        <div className="container relative h-[640px] sm:h-[800px] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-zinc-900"></div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">"Exceptional care, happy tails our dog's favorite part of the day!"</p>
                        <footer className="text-sm">- Sarah Smith</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex flex-col justify-center space-y-6 w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
                    </div>
                    <div className="grid gap-6">
                        <form onSubmit={handleLogin}>
                            <div className="grid gap-2">
                                <div className="grid gap-1">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only" htmlFor="Email">Email</label>
                                    <input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        id="email"
                                        placeholder="name@example.com"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        type="email"
                                        value={email}
                                        required={true}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button disabled={loading} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                                    {loading ? "Loading..." : "Sign Up"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <p className="px-8 text-center text-sm text-muted-foreground">By clicking continue, you agree to our <a className="underline underline-offset-4 hover:text-primary" href="/terms">Terms of Service</a> and <a className="underline underline-offset-4 hover:text-primary" href="/privacy">Privacy Policy</a>.</p>
                </div>
            </div>
        </div>
    )
}