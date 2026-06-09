'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { LogIn } from 'lucide-react'
import { AuthModal } from './AuthModal'

const AuthButton = ({ user }) => {

    const [showAuthModal, setShowAuthModal] = useState(false)

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
