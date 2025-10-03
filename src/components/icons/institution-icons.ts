import {
  CarFront,
  IdCard,
  Home,
  Landmark,
  Activity,
  Tv,
  UtilityPole,
  ShieldCheck,
  FileText,
  Users,
} from 'lucide-react'

export const institutionIconMap: Record<string, any> = {
  dvla: CarFront,
  'driving licence': IdCard,
  council: Landmark,
  'council tax': Landmark,
  nhs: Activity,
  dentist: Activity,
  gp: Activity,
  'tv licence': Tv,
  utilities: UtilityPole,
  bank: ShieldCheck,
  hmrc: FileText,
  clubs: Users,
}

// helper to fetch by title safely
export function getIconFor(title: string) {
  const key = title.toLowerCase()
  for (const k of Object.keys(institutionIconMap)) {
    if (key.includes(k)) return institutionIconMap[k]
  }
  return Home
}
