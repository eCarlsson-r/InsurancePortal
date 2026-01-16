import { z } from 'zod';

export const agencySchema = z.object({
    id: z.number().int().optional(),
    name: z.string(),
    city: z.string(),
    director: z.string(),
    leader: z.string(),
});

export const agentProgramSchema = z.object({
    id: z.number().int().optional(),
    agent_id: z.number().int().optional(),
    program_id: z.number().int().nullable(),
    position: z.string(),
    program_start: z.string(),
    program_end: z.coerce.date().optional(),
    agent_leader_id: z.number().int().nullable(),
    allowance: z.number().int().nullable(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
});

export const agentSchema = z.object({
    id: z.number().int().optional(),
    official_number: z.string(),
    apply_date: z.string(),
    apply_place: z.string(),
    agency_id: z.number().int(),
    name: z.string(),
    gender: z.number().int(),
    birth_place: z.string(),
    birth_date: z.string(),
    address: z.string(),
    religion: z.string(),
    identity_number: z.string(),
    tax_number: z.string(),
    city: z.string(),
    province: z.string(),
    postal_code: z.string(),
    education: z.string(),
    phone: z.string(),
    mobile: z.string(),
    email: z.string().email(),
    status: z.number().int(),
    spouse: z.string(),
    occupation: z.string(),
    dependents: z.number().int(),
    license: z.string(),
    due_date: z.string(),
    recruiter_id: z.number().int(),
    notes: z.string(),
    programs: z.array(agentProgramSchema),
});

export const contestSchema = z.object({
    id: z.number().int().optional(),
    name: z.string(),
    type: z.string(),
    start: z.string(),
    end: z.string(),
    product: z.string(),
    level: z.string(),
    minimum_commision: z.number().int(),
    minimum_premium: z.number().int(),
    minimum_policy: z.number().int(),
    bonus_percent: z.number().int(),
    bonus_amount: z.number().int(),
    reward: z.string(),
});

export const customerSchema = z.object({
    id: z.number().int().optional(),
    name: z.string(),
    gender: z.number().int(),
    identity: z.string(),
    mobile: z.string(),
    email: z.string().email(),
    birth_date: z.string(),
    birth_place: z.string(),
    religion: z.number().int(),
    marital: z.number().int(),
    profession: z.string(),
    home_address: z.string(),
    home_postal: z.string(),
    home_city: z.string(),
    work_address: z.string(),
    work_postal: z.string(),
    work_city: z.string(),
    description: z.string(),
});

export const fileSchema = z.object({
    file_id: z.number().int().optional(),
    file_name: z.string(),
    file_type: z.string(),
    file_ext: z.string(),
    file_size: z.number().int(),
    file_upload_date: z.coerce.date(),
    file_purpose: z.string(),
    file_document_id: z.string(),
});

export const fundSchema = z.object({
    id: z.number().int().optional(),
    name: z.string(),
    currency: z.string(),
});

export const investmentSchema = z.object({
    id: z.number().int().optional(),
    case_id: z.number().int().optional(),
    fund_id: z.number().int(),
    allocation: z.number(),
});


export const productCommissionSchema = z.object({
    id: z.number().int().optional(),
    product_id: z.number().int(),
    payment_method: z.number().int(),
    currency: z.number().int(),
    year: z.number().int(),
    payment_period: z.number().int(),
    commission_rate: z.number(),
    extra_commission: z.number(),
});

export const productCreditSchema = z.object({
    id: z.number().int().optional(),
    product_id: z.number().int(),
    production_credit: z.number(),
    contest_credit: z.number(),
    credit_start: z.coerce.date(),
    credit_end: z.coerce.date(),
});

export const productSchema = z.object({
    id: z.number().int().optional(),
    name: z.string(),
    type: z.string(),
    commissions: z.array(productCommissionSchema),
    credits: z.array(productCreditSchema),
});

export const riderSchema = z.object({
    id: z.number().int().optional(),
    case_id: z.number().int().optional(),
    product_id: z.number().int(),
    insure_amount: z.number(),
    premium: z.number().int(),
    insure_period: z.number().int(),
    pay_period: z.number().int(),
    add_date: z.coerce.date().optional(),
});

export const policySchema = z
    .object({
        id: z.string(),
        policy_no: z.string(),
        holder_id: z.number().int().optional(),
        insured_id: z.number().int().optional(),
        agent_id: z.number().int(),
        holder_insured_relationship: z.string(),
        entry_date: z.coerce.date(),
        bill_at: z.number().int(),
        is_insure_holder: z.boolean(),
        product_id: z.number().int(),
        insure_period: z.number().int(),
        pay_period: z.number().int(),
        currency_id: z.number().int(),
        curr_rate: z.number(),
        start_date: z.coerce.date(),
        base_insure: z.number(),
        premium: z.number().int(),
        pay_method: z.number().int(),
        description: z.string(),
        holder: customerSchema,
        insured: customerSchema,
        investments: z.array(investmentSchema),
        riders: z.array(riderSchema),
        customer: customerSchema.optional(),
        product: productSchema.optional()
    })
    .superRefine((values, ctx) => {
        // If they are NOT the same person, make insured fields mandatory
        if (!values.is_insure_holder) {
            if (!values.insured.name || values.insured.name.length < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Insured name is required when insured is not the same as holder',
                    path: ['insured', 'name'],
                });
            }
            if (
                !values.holder_insured_relationship ||
                values.holder_insured_relationship === ''
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please select relationship',
                    path: ['holder_insured_relationship'],
                });
            }
        }
    }
);

export const programSchema = z.object({
    id: z.number().int().optional(),
    name: z.string(),
    position: z.string(),
    min_allowance: z.number().int(),
    max_allowance: z.number().int(),
    duration: z.number().int(),
    direct_calculation: z.number().int(),
    indirect_calculation: z.number().int(),
    targets: z.array(z.lazy(() => programTargetSchema)),
});

export const programTargetSchema = z.object({
    id: z.number().int().optional(),
    program_id: z.number().int(),
    allowance: z.number().int(),
    month: z.number().int(),
    case_month: z.number().int(),
    fyp_month: z.number().int(),
});

export const receiptSchema = z.object({
    id: z.number().int().optional(),
    policy_code: z.string(),
    agent_id: z.number().int().nullable(),
    premium: z.number().int(),
    currency_rate: z.number(),
    pay_method: z.number().int(),
    pay_date: z.string(),
    paid_date: z.string(),
    paid_amount: z.number().int(),
    description: z.string(),
    policy: policySchema.optional()
});

export type Agency = z.infer<typeof agencySchema>;
export type Agent = z.infer<typeof agentSchema>;
export type AgentProgram = z.infer<typeof agentProgramSchema>;
export type Contest = z.infer<typeof contestSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type File = z.infer<typeof fileSchema>;
export type Fund = z.infer<typeof fundSchema>;
export type Investment = z.infer<typeof investmentSchema>;
export type Policy = z.infer<typeof policySchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductCommission = z.infer<typeof productCommissionSchema>;
export type ProductCredit = z.infer<typeof productCreditSchema>;
export type Program = z.infer<typeof programSchema>;
export type ProgramTarget = z.infer<typeof programTargetSchema>;
export type Receipt = z.infer<typeof receiptSchema>;
export type Rider = z.infer<typeof riderSchema>;
