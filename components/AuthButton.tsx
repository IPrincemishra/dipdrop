'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { LogIn, LogOut } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { signOut } from '@/app/action'
import { User } from '@supabase/supabase-js'

type Props = {
    user: User | null
}

const AuthButton = ({ user }: Props) => {

    const [showAuthModal, setShowAuthModal] = useState(false)

    if (user) {
        return (
            <form action={signOut}>
                <Button variant={"ghost"} size={"sm"} type='submit' className='gap-2 cursor-pointer'>
                    <LogOut className='w-4 h-4' />
                    Sign Out
                </Button>
            </form>
        )
    }

    return (
        <>
            <Button
                onClick={() => setShowAuthModal(true)}
                variant={"default"}
                size={"sm"}
                className="bg-[#ff5622e0] hover:bg-[#ff5622] gap-2 cursor-pointer">
                <LogIn className="w-4 h-4" />
                Sign In
            </Button>
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </>
    )
}

export default AuthButton
