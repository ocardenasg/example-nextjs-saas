import { supabase } from '@/utils/supabase'

export default function Lesson({ lesson }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
    </main>
  )
}

export async function getStaticPaths() {
  const { data: lessons } = await supabase.from('lessons').select('*')

  const paths = lessons.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { id } }) {
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()

  return {
    props: {
      lesson,
    },
  }
}
