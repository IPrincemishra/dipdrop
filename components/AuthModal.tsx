'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/utils/supabase/client"

type Props = {
    isOpen: boolean,
    onClose: (open: boolean) => void
}

export function AuthModal({ isOpen, onClose }: Props) {
    const supabase = createClient()

    const handleGoogleLogin = async () => {
        const { origin } = window.location

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${origin}/auth/callback`
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Sign in to continue</DialogTitle>
                    <DialogDescription>
                        Track product prices and get alerts on price drops
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <Button
                        onClick={handleGoogleLogin}
                        variant={"outline"}
                        className="w-full gap-2 cursor-pointer"
                        size={"lg"}
                    >
                        <svg width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                        </svg>
                        Contiune with Google
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
