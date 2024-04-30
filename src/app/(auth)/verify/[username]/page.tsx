"use client";

import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()

    // zod implementation

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace('/sign-in/')
        } catch (error) {

            console.error("Error in verifying the user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify your account
                </h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount