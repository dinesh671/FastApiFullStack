import * as z from 'zod'

export const signupSchema = z.object({
    name:z.string().min(4, "Name is required"),
    email:z.string().email("Don't u have an valid email"),
    password:z.string().min(8, "password must be 8 chars bro"),
    confirmPassword:z.string()
}).refine((data)=> data.password=== data.confirmPassword,{
    message:"password don't match",
    path:["confirmPassword"]
})

export const loginSchema = z.object({
    email:z.string().email("Enter the correct email"),
    password:z.string()
})

export const forgotPasswordSchema = z.object({
    email:z.string().email("please enter a valid email")
})