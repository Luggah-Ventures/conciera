// src/components/icons/institution-icons.ts
import type { LucideIcon } from 'lucide-react'
import {
  Home,
  Car,
  Landmark,
  Hospital,
  HeartPulse,
  Users,
  Tv,
  Bolt,
  Building2,
  MapPin,
  Banknote,
  IdCard,
  Mail,
  ShieldCheck,
  Settings,
} from 'lucide-react'

/**
 * Map string keys (from your DB or UI) to Lucide icons.
 * Add/rename keys here to match what you use in code or in the DB.
 */
export const institutionIcons: Record<string, LucideIcon> = {
  // government & identity
  dvla: Car,
  hmrc: Landmark,
  council: Building2,
  id: IdCard,

  // health
  nhs: Hospital,
  gp: HeartPulse,
  dentist: HeartPulse,

  // utilities & services
  utilities: Bolt,
  tv_licence: Tv,
  address: Home,
  mail: Mail,

  // lifestyle / misc
  gym: Users,
  bank: Banknote,
  location: MapPin,
  security: ShieldCheck,
  settings: Settings,
}

/**
 * Get a Lucide icon by key, safely typed.
 */
export function getInstitutionIcon(key?: string): LucideIcon | undefined {
  if (!key) return undefined
  return institutionIcons[key.toLowerCase()]
}

// If you prefer default export for the whole map:
// export default institutionIcons;
