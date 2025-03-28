import { useEventBus } from '@/EventBus'
import { MessageOptionsDropdownProps } from '@/types'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ShieldCheckIcon, TrashIcon, UserIcon } from '@heroicons/react/16/solid'
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid'
import axios from 'axios'
import { Fragment, useMemo } from 'react'

const MessageOptionsDropdown: React.FC<MessageOptionsDropdownProps> = ({ message }) => {
  const { emit } = useEventBus()

  const onMessageDelete = async (e: any) => {
    e.stopPropagation()
    console.log("Delete message")

    await axios.delete(route('message.destroy', message.id))
      .then((res) => {
        console.log(res.data)
        emit('message.deleted', { message, prevMessage: res.data.message })
      })
      .catch((error) => {

      })
  }

  return (
    <div className='absolute right-full text-gray-200 top-1/2 -translate-y-1/2 z-10'>
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
                        `bg-black/30 text-white group flex w-full items-center rounded-md px-2 py-2 text-sm`
                      }
                      onClick={onMessageDelete}
                    >
                      <TrashIcon className='w-4 h-4 mr-2'  />
                      Delete
                    </button>
              {/* <MenuItem>
                {
                  ({ focus }) => (
                    <button
                      className={
                        `${focus ? "bg-black/30 text-white" : "text-gray-100"}
                         group flex w-full items-center rounded-md px-2 py-2 text-sm`
                      }
                      onClick={onMessageDelete}
                    >
                      <TrashIcon className='w-4 h-4 mr-2'  />
                      Delete
                    </button>
                  )
                }
              </MenuItem> */}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  )
}

export default MessageOptionsDropdown