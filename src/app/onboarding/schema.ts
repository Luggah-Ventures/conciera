import { z } from 'zod'

export const onboardingSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  move_date: z.string().min(1, 'Move date is required'),

  current_address: z.string().min(1),
  new_address: z.string().min(1),
  new_postcode: z.string().min(1),

  adults: z.number().min(0),
  children: z.number().min(0),
  pets: z.number().min(0),

  vehicle_owned: z.boolean(),
  driving_licence_no: z.string().optional().default(''),

  pref_greenEnergy: z.boolean(),
  pref_fibrePreferred: z.boolean(),
  pref_budgetRange: z.string().optional().default(''),

  clubs_interests: z.string().optional().default(''),
  clubs_gymPriority: z.boolean(),
})
export type OnboardingFormValues = z.infer<typeof onboardingSchema>
