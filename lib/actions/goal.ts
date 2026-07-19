'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateLearningGoal({
  studentId,
  goal,
}: {
  studentId: string
  goal: string
}) {
  const supabase = createClient()
  await supabase
    .from('students')
    .update({ learning_goal: goal })
    .eq('id', studentId)
  revalidatePath('/home')
}
