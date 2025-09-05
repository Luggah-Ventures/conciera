import { addDays, subDays, format } from 'date-fns'
import { getSupabaseServerClientAction } from '@/lib/supabase/server'

type Institution = {
  id: string
  title: string
  notes: string | null
  link: string | null
  template: string | null
}

// Calculate due date relative to move date
function dueOffset(institutionId: string, moveDate: Date) {
  switch (institutionId) {
    case 'utilities-broadband':
      return subDays(moveDate, 14)
    case 'bank':
      return subDays(moveDate, 3)
    case 'tv-licence':
      return subDays(moveDate, 3)
    case 'council-tax':
      return subDays(moveDate, 7)
    case 'dvla-v5c':
      return addDays(moveDate, 1)
    case 'dvla-licence':
      return addDays(moveDate, 3)
    case 'voter':
      return addDays(moveDate, 3)
    case 'hmrc':
      return addDays(moveDate, 7)
    case 'gp':
      return addDays(moveDate, 7)
    case 'dentist':
      return addDays(moveDate, 7)
    case 'clubs-societies':
      return addDays(moveDate, 14) // give user 2 weeks buffer
    default:
      return moveDate
  }
}

// Replace {{placeholders}} in templates with real data
function mergeTemplate(tmpl: string, data: Record<string, string>) {
  return tmpl.replace(/\{\{(\w+)\}\}/g, (_, k) => data[k] ?? '')
}

export async function generateTasksForMove(moveId: string, selectedInstitutionIds: string[]) {
  const supabase = await getSupabaseServerClientAction()

  // Fetch move row
  const { data: move } = await supabase.from('moves').select('*').eq('id', moveId).single()
  if (!move) return

  // Fetch profile (for full_name)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', move.user_id)
    .single()

  // Fetch institutions selected
  const instRes = await supabase
    .from('institutions')
    .select('id,title,notes,link,template')
    .in('id', selectedInstitutionIds)

  const inst = instRes.data as Institution[] | null
  if (!inst || inst.length === 0) return

  const moveDate = new Date(move.move_date)

  // Prepare template data
  const templateData = {
    full_name: (profile?.full_name ?? '').toString(),
    new_address: move.new_address,
    current_address: move.current_address,
    new_postcode: (move.new_postcode ?? '').toString(),
    move_date: format(moveDate, 'yyyy-MM-dd'),
    preferences: JSON.stringify(move.preferences || {}),
    driving_licence_no: (move.driving_licence_no ?? '').toString(),
    clubs_interests: (move.clubs_prefs?.interests ?? '').toString(),
  }

  // Special case: build Maps search link for clubs
  function buildLink(instId: string) {
    if (instId === 'clubs-societies') {
      const search = templateData.clubs_interests
        ? encodeURIComponent(`${templateData.clubs_interests} near ${templateData.new_postcode}`)
        : encodeURIComponent(`clubs near ${templateData.new_postcode}`)
      return `https://www.google.com/maps/search/${search}`
    }
    if (!inst) return ''
    return inst.find((i: Institution) => i.id === instId)?.link ?? ''
  }

  const rows = inst.map((i: Institution) => ({
    move_id: moveId,
    institution_id: i.id,
    slug: i.id,
    title: i.title,
    description: i.notes ?? undefined,
    due_date: dueOffset(i.id, moveDate),
    status: 'not_started' as const,
    link: buildLink(i.id),
    generated_template: i.template ? mergeTemplate(i.template, templateData) : null,
  }))

  await supabase.from('tasks').insert(rows)
}

export async function markTaskStatus(
  taskId: string,
  status: 'not_started' | 'in_progress' | 'done'
) {
  const supabase = await getSupabaseServerClientAction()
  await supabase.from('tasks').update({ status }).eq('id', taskId)
}
