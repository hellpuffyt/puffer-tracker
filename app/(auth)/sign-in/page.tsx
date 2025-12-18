"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import {signInWithEmail} from "../../../lib/actions/auth.actions";

type SignInFormData = {
    email: string;
    password: string;
};

export default function SignInPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<SignInFormData>();

    const onSubmit = async (data: SignInFormData) => {
        try {
            const res = await signInWithEmail(
                    data.email,
                    data.password,
                );

            if (!res.success) {
                toast.error(result?.error ?? "Invalid credentials");
                return;
            }

            toast.success("Signed in successfully");
            router.push("/");
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <h1 className="form-title">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Email is required" }}
                />

                <InputField
                    name="password"
                    label="Password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: "Password is required" }}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="yellow-btn w-full mt-5"
                >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>

                <FooterLink
                    text="Don't have an account?"
                    linkText="Create one"
                    href="/sign-up"
                />
            </form>
        </>
    );
}
