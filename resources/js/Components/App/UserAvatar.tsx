import { CheckBadgeIcon, GlobeAltIcon } from '@heroicons/react/16/solid'
import React from 'react'

const UserAvatar = ({ user, online = null, profile = false }: any) => {
  let onlineClsses = online === true ? "online" : online === false ? "offline" : ""

  const sizeClass = profile ? "w-40": "w-8"

  return (
    <>
      {
        user.avatar_url && (
          <div className={`chat-image avatar ${onlineClsses}`}>
            <div className={`rounded-full ${sizeClass}`}>
              <img src={user.avatar_url} alt="avatar_url" />
            </div>
          </div>
        )
      }

      {
        !user.avatar_url && (
          <div className={`chat-image avatar placeholder ${onlineClsses}`}>
            <div className={`${online ? "bg-green-600": "bg-gray-400"} text-gray-800 rounded-full ${sizeClass}`}>
              <span className='text-xl ml-2'>
                {user.name.substring(0,1)}
              </span>
            </div>
          </div>
        )
      }
    </>
  )
}

export default UserAvatar