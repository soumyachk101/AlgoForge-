"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Terminal, Mail, Lock, Loader2 } from "lucide-react"
import { Icons } from "@/components/icons"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
})

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function LoginForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        // TODO: Implement actual login logic
        setTimeout(() => {
            console.log(values)
            setIsLoading(false)
            toast.success("Logged in successfully!")
        }, 1000)
    }

    return (
        <Card className={cn("w-full bg-clay dark:bg-zinc-900 border-none shadow-skeuo", className)} {...props}>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-center">Sign in</CardTitle>
                <CardDescription className="text-center">
                    Enter your email below to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="ml-1">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    className="pl-10 bg-transparent border-none shadow-skeuo-inset rounded-xl focus:ring-0 focus:shadow-skeuo-inset transition-all"
                                    {...form.register("email")}
                                />
                            </div>
                            {form.formState.errors.email && (
                                <p className="text-sm text-destructive ml-1">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="ml-1">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    type="password"
                                    autoCapitalize="none"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    className="pl-10 bg-transparent border-none shadow-skeuo-inset rounded-xl focus:ring-0 focus:shadow-skeuo-inset transition-all"
                                    {...form.register("password")}
                                />
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-sm text-destructive ml-1">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>
                        <Button disabled={isLoading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(255,255,255,0.2)] hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2),inset_-5px_-5px_10px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-200">
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Sign In
                        </Button>
                    </div>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted-foreground/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-clay dark:bg-zinc-900 px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" disabled={isLoading} className="h-10 rounded-xl border-none bg-transparent shadow-skeuo hover:shadow-skeuo-inset active:scale-[0.98] transition-all">
                        <Icons.gitHub className="mr-2 h-4 w-4" />
                        GitHub
                    </Button>
                    <Button variant="outline" type="button" disabled={isLoading} className="h-10 rounded-xl border-none bg-transparent shadow-skeuo hover:shadow-skeuo-inset active:scale-[0.98] transition-all">
                        <Icons.google className="mr-2 h-4 w-4" />
                        Google
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center gap-2">
                <div className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline underline-offset-4 font-medium transition-colors">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
