'use client'

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { addProduct } from '@/app/action'
import { toast } from 'sonner'

function AddProductForm({ user }) {

    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        if (!user) {
            setShowAuthModal(true)
            return
        }
        setLoading(true)

        const formData = new FormData()
        formData.append("url", url)

        const result = await addProduct(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.message || "Product tracked successfully")
            setUrl("")
        }

        setLoading(false)
    }

    return (
        <>
            <form className='w-full max-w-2xl mx-auto' onSubmit={handleSubmit}>
                <div className='flex flex-col sm:flex-row gap-2'>
                    <Input
                        type='url'
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder='Paste product URL (Amazon, Walmart, etc.'
                        className='h-12 text-base outline-none'
                        required
                        disabled={loading}
                    />
                    <Button
                        type='submit'
                        disabled={loading}
                        size={"lg"}
                        className='bg-[#ff5622ea] hover:bg-[#ff5622] transition h-10 sm:h-12 px-8 cursor-pointer'>
                        {
                            loading ? (
                                <>
                                    <Loader2 className='mr-4 h-4 w-4 animate-spin' />
                                </>
                            ) : (
                                "Track Price"
                            )}
                    </Button>
                </div>
            </form>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    )
}

export default AddProductForm
