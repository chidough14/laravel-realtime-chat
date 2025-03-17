import { AudioRecorderProps } from '@/types'
import { MicrophoneIcon, StopCircleIcon } from '@heroicons/react/16/solid'
import { useState } from 'react'

const AudioRecorder: React.FC<AudioRecorderProps> = ({ fileReady }) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recording, setRecording] = useState<boolean>(false)

  const onMicrophoneClick = async () => {
    if (recording) {
      setRecording(false)

      if (mediaRecorder) {
        mediaRecorder.stop()
        setMediaRecorder(null)
      }
      return
    }

    setRecording(true)

    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const newMediaRecorder: MediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      newMediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
        chunks.push(event.data)
      })

      newMediaRecorder.addEventListener('stop', () => {
        let audioBlob = new Blob(chunks, {
          type: "audio/ogg; codecs=opus"
        })

        let audioFile = new File([audioBlob], "recorded_audio.ogg", {
           type: "audio/ogg; codecs=opus"
        })

        const url = URL.createObjectURL(audioFile)

        fileReady(audioFile, url)
      })

      newMediaRecorder.start()
      setMediaRecorder(newMediaRecorder)
    } catch (error) {
      setRecording(false)
      console.log("Error accessing microphone", error)
    }
  }

  return (
    <button 
      onClick={onMicrophoneClick}
      className='text-gray-400 p-1 hover:text-gray-200'
    >

      {
        recording ? <StopCircleIcon className='w-6 text-red-600' /> : <MicrophoneIcon className='w-6' />
      }
    </button>
  )
}

export default AudioRecorder