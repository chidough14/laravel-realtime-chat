import { useEventBus } from '@/EventBus'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import UserAvatar from './UserAvatar'
import { Link } from '@inertiajs/react'

const NewMessageNotification = () => {
  const [toasts, setToasts] = useState<any>([])
  const { on }: any = useEventBus()

  useEffect(() => {
    on('newMessageNotification', ({ message, user, group_id }: any) => {
      const uuid = uuidv4()

      setToasts((oldToasts: any) => [...oldToasts, { message, uuid, user, group_id }])

      setTimeout(() => {
        setToasts((oldToasts: any) => oldToasts.filter((toast: any) => toast.uuid !== uuid))
      }, 3000)
    })
  }, [on])

  return (
    <div className='toast toast-top toast-center min-w-[280px]'>
      {
        toasts.map((toast: any, index: number) => (
          <div key={toast.uuid} className='alert alert-success py-3 px-4 text-gray-100 rounded-md'>
            <Link 
              href={toast.group_id ? route('chat.group', toast.group_id) : route('chat.user', toast.user.id)}
              className='flex items-center gap-2'
            >
              <UserAvatar user={toast.user} />
              <span>{toast.message}</span>
            </Link>
          </div>
        ))
      }
    </div>
  )
}

export default NewMessageNotification