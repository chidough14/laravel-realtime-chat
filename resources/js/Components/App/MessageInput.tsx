import {
  FaceSmileIcon,
  HandThumbUpIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  PhotoIcon
} from '@heroicons/react/24/solid'
import { Fragment, useState } from 'react'
import NewMessageInput from './NewMessageInput'
import axios from 'axios'
import EmojiPicker from 'emoji-picker-react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'

const MessageInput = ({ conversation = null }: any) => {
  const [newMessage, setNewMesaage] = useState("")
  const [inputErrorMessage, setInputErrorMessage] = useState("")
  const [messageSending, setMessageSending] = useState(false)

  const onSendClick = () => {
    if (messageSending) {
      return
    }

    if (newMessage.trim() === "") {
      setInputErrorMessage("Please enter a message or upload attachments")

      setTimeout(() => {
        setInputErrorMessage("")
      }, 300);
      return
    }

    const formData = new FormData()
    formData.append("message", newMessage)

    if (conversation.is_user) {
      formData.append("receiver_id", conversation.id)
    } else if (conversation.is_group) {
      formData.append("group_id", conversation.id)
    }

    setMessageSending(true)

    axios.post(route('message.store'), formData, {
      onUploadProgress: (progressEvent: any) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) / 100)
      }
    })
      .then((res) => {
        setNewMesaage("")
        setMessageSending(false)
      })
      .catch((err) => {
        setMessageSending(false)
      })
  }

  const onLikeClick = () => {
    if (messageSending) {
      return
    }

    const data: any = {
      message: "👍"
    }

    if (conversation.is_user) {
      data['receiver_id'] = conversation.id
    } else if (conversation.is_group) {
      data['group_id'] = conversation.id
    }

    axios.post(route('message.store'), data)

  }

  return (
    <div className='flex flex-wrap items-start border-t border-slate-700 py-3'>
      <div className='order-2 flex-1 xs:flex-none xs:order-1 p-2'>
        <button className='p-1 text-gray-400 hover:text-gray-300 relative'>
          <PaperClipIcon className='w-6' />

          <input
            type='file'
            multiple
            className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer'
          />
        </button>

        <button className='p-1 text-gray-400 hover:text-gray-300 relative'>
          <PhotoIcon className='w-6' />
          <input
            type='file'
            multiple
            accept='image/*'
            className='absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer'
          />
        </button>
      </div>

      <div className='order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative'>
        <div className='flex'>
          <NewMessageInput
            value={newMessage}
            onSend={onSendClick}
            onChange={(e: any) => setNewMesaage(e.target.value)}
          />

          <button className='btn btn-info rounded-l-none' onClick={onSendClick} disabled={messageSending}>
            {/* {
              messageSending && (
                <span className='loading loading-spinner loading-xs'></span>
              )
            } */}
            <PaperAirplaneIcon className='w-6' />
            <span className='hidden sm:inline'>Send</span>
          </button>
        </div>

        {
          inputErrorMessage && (
            <p className='text-xs text-red-400'>{inputErrorMessage}</p>
          )
        }
      </div>

      {/* <EmojiPicker /> */}
      <div className='order-3 xs:order-3 p-2 flex'>
        <Popover className='relative'>
          <PopoverButton className='p-1 text-gray-400 hover:text-gray-300'>
            <FaceSmileIcon className='w-6 h-6' />
          </PopoverButton>

          <PopoverPanel className='absolute z-10 right-0 bottom-full'>
            <EmojiPicker 
              theme='dark' 
              onEmojiClick={(e: any) => setNewMesaage(newMessage + e.emoji)}
            >

            </EmojiPicker>
          </PopoverPanel>
        </Popover>

        <button className='p-1 text-gray-400 hover:text-gray-300' onClick={onLikeClick}>
          <HandThumbUpIcon className='w-6 h-6' />
        </button>
      </div>
    </div>
  )
}

export default MessageInput