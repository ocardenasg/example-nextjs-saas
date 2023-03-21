import Link from 'next/link'

import { useUser } from '@/context/user'
import { supabase } from '@/utils/supabase'

export default function Home({ lessons }) {
  const { user } = useUser()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      {user?.email}
      {lessons.map(lesson => (
        <p key={lesson.id}>
          <Link href={`/${lesson.id}`}>{lesson.title}</Link>
        </p>
      ))}
    </main>
  )
}

export async function getStaticProps() {
  const { data: lessons } = await supabase.from('lessons').select('*')

  return {
    props: {
      lessons,
    },
  }
}
