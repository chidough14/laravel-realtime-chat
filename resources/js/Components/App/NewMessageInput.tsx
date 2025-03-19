import { NewMessageInputProps } from '@/types'
import React, { useEffect, useRef } from 'react'

const NewMessageInput: React.FC<NewMessageInputProps> = ({ value, onChange, onSend }) => {
  const input = useRef<HTMLTextAreaElement | null>(null)

  const onInputKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const onChangeEvent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      adjustHeight()
    }, 10)

    onChange(e)
  }

  const adjustHeight = () => {
    setTimeout(() => {
      if (input.current) {
        input.current.style.height = "auto"
        input.current.style.height = input.current.scrollHeight + 1 + "px"
      }
    }, 100)
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  return (
    <textarea
      ref={input}
      value={value}
      rows={1}
      placeholder='Type a message'
      onKeyDown={onInputKeydown}
      onChange={(e) => onChangeEvent(e)}
      className='input input-bordered w-full rounded-r-none resize-none overflow-y-auto max-h-40'
    ></textarea>
  )
}

export default NewMessageInput