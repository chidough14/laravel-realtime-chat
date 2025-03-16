import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/16/solid'
import React, { useRef, useState } from 'react'

const CustomAudioPlayer = ({ file, showVolume = true }: { file: any, showVolume: boolean }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(1)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)

  const togglePlayPause = () => {
    const audio: any = audioRef.current

    if (isPlaying) {
      audio.pause()
    } else {
      console.log(audio, audio.duration)
      setDuration(audio.duration)
      audio.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = volume
    }

    setVolume(volume)
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    const audio = audioRef.current

    if (audio) {
      setDuration(audio.duration)
    }

    setCurrentTime(e.currentTarget.currentTime)
  }

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLMediaElement>) => {
    setDuration(e.currentTarget.duration)
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value)

    if (audioRef.current) {
      audioRef.current.currentTime = time
    }

    setCurrentTime(time)
  }


  return (
    <div className='w-full items-center gap-2 py-2 px-2 rounded-md bg-slate-800'>
      <audio
        controls
        ref={audioRef}
        src={file.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className='hidden'
      />

      <button onClick={togglePlayPause}>
        {
          isPlaying && <PauseCircleIcon className='w-6 text-gray-400' />
        }

        {
          !isPlaying && <PlayCircleIcon className='w-6 text-gray-400' />
        }
      </button>
      {
        showVolume && (
          <input
            type='range'
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        )
      }

      <input
        type='range'
        className='flex-1'
        min="0"
        max={duration}
        step="0.01"
        value={currentTime}
        onChange={handleSeekChange}
      />
    </div>
  )
}

export default CustomAudioPlayer