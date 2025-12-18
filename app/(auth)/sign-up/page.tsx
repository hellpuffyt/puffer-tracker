'use client';

import { useForm } from "react-hook-form";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import {
    INVESTMENT_GOALS,
    PREFERRED_INDUSTRIES,
    RISK_TOLERANCE_OPTIONS
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {signUpWithEmail} from "../../../lib/actions/auth.actions";

type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
    country: string;
    investmentGoals: string;
    riskTolerance: string;
    preferredIndustry: string;
};

export default function SignUp() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            country: "US",
            investmentGoals: "Growth",
            riskTolerance: "Medium",
            preferredIndustry: "Technology",
        },
    });

    const onSubmit = (data: SignUpFormData) => {
        console.log("✅ SUBMITTED:", data);
        const res = signUpWithEmail(data.email, data.password, data.fullName);
        if(!res.success){
            toast.error("Something went wrong");
            return;
        }
        toast.success("Form submit works");
        router.push("/sign-in");
    };

    return (
        <>
            <h1 className="form-title">Sign Up & Personalize</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="fullName"
                    label="Full Name"
                    placeholder="John Doe"
                    register={register}
                    error={errors.fullName}
                    validation={{ required: "Full name is required" }}
                />

                <InputField
                    name="email"
                    label="Email"
                    placeholder="you@example.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Email is required" }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: "Password is required", minLength: 8 }}
                />

                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                />

                <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                />

                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                />

                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                />

                {/* IMPORTANT: native button */}
                <button
                    type="submit"
                    className="yellow-btn w-full mt-5"
                >
                    Start Your Investing Journey
                </button>

                <FooterLink
                    text="Already have an account?"
                    linkText="Sign in"
                    href="/sign-in"
                />
            </form>
        </>
    );
}
