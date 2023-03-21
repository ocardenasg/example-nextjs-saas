import { useState, useEffect, useCallback } from 'react'
import Video from 'react-player'

import { supabase } from '@/utils/supabase'

export default function Lesson({ lesson }) {
  const [videoUrl, setVideoUrl] = useState()

  const getPremiumContent = useCallback(async () => {
    const { data } = await supabase
      .from('premium_content')
      .select('video_url')
      .eq('id', lesson.id)
      .single()

    setVideoUrl(data?.video_url)
  }, [lesson.id])

  useEffect(() => {
    getPremiumContent()
  }, [getPremiumContent])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{lesson.title}</h1>
      <p>{lesson.description}</p>
      {!!videoUrl && <Video url={videoUrl} width="100%" height="100vh" />}
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
