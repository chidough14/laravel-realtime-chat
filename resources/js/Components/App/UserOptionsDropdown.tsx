import { useEventBus } from '@/EventBus'
import { Conversation, UserConversation } from '@/types'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ShieldCheckIcon, UserIcon } from '@heroicons/react/16/solid'
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid'
import axios from 'axios'
import { Fragment } from 'react'

const UserOptionsDropdown = ({ conversation }: any) => {
  // function isUserBlocked (convo: Conversation): convo is UserConversation{
  //   return 'blocked_at' in convo
  // }

  // function isUserAdmin (convo: Conversation): convo is UserConversation{
  //   return 'is_admin' in convo
  // }
  const { emit } = useEventBus()

  // function isUserBlocked (convo: any) {
  //   return convo.blocked_at === true
  // }

  // function isUserAdmin (convo: any) {
  //   return convo.is_admin === true
  // }

  const changeUserRole = () => {
    if (!conversation.is_user) {
      return
    }

    axios.post(route('user.changeRole', conversation.id))
      .then((res) => {
        emit('toast.show', res.data.message)
        console.log(res.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const unblockUser = () => {
    if (!conversation.is_user) {
      return
    }

    axios.post(route('user.blockUnblock', conversation.id))
      .then((res) => {
        emit('toast.show', res.data.message)
        console.log(res.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40">
            <EllipsisVerticalIcon className='h-5 w-5' />
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <MenuItems className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50">
            <div className='px-1 py-1'>

              <button
                className={
                  `"bg-black/30 text-white group flex w-full items-center rounded-md px-2 py-2 text-sm`
                }
                onClick={unblockUser}
              >
                {
                  conversation.blocked_at && (
                    <>
                      <LockOpenIcon className='w-4 h-4 mr-2' /> Unlock User
                    </>
                  )
                }


                {
                  !conversation.blocked_at && (
                    <>
                      <LockClosedIcon className='w-4 h-4 mr-2' /> Block User
                    </>
                  )
                }
              </button>

            </div>

            <div className='px-1 py-1'>
              <button
                className={
                  `bg-black/30 text-white group flex w-full items-center rounded-md px-2 py-2 text-sm`
                }
                onClick={changeUserRole}
              >
                {
                  conversation.is_admin && (
                    <>
                      <UserIcon className='w-4 h-4 mr-2' /> Make regular user
                    </>
                  )
                }
                {
                  !conversation.is_admin && (
                    <>
                      <ShieldCheckIcon className='w-4 h-4 mr-2' /> Make Admin
                    </>
                  )
                }
              </button>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  )
}

export default UserOptionsDropdown