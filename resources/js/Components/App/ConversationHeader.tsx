import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid"
import { Link, usePage } from "@inertiajs/react"
import UserAvatar from "./UserAvatar"
import GroupAvatar from "./GroupAvatar"
import { Conversation, GroupConversation, UserConversation } from "@/types"
import { useEventBus } from "@/EventBus"
import axios from "axios"
import GroupDescriptionPopover from "./GroupDescriptionPopover"
import GroupUsersPopover from "./GroupUsersPopover"


const ConversationHeader = ({ selectedConversation }: { selectedConversation: Conversation }) => {
  const { emit } = useEventBus()
  const {user} = usePage().props.auth

  function isUserConversation (convo: Conversation): convo is UserConversation {
    return convo.is_user === true
  }

  function isGroupConversation (convo: Conversation): convo is GroupConversation {
    return convo.is_group === true
  }

  const onDeleteGroup = () => {
    if (!window.confirm("Are you sure you want to delete this group?")) {
      return
    }

    axios.delete(route('group.destroy', selectedConversation.id))
      .then((res) => {
        console.log(res)
        emit('toast.show', res.data.message)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      {
        selectedConversation && (
          <div className="p-3 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Link href={route('dashboard')} className="inline-block sm:hidden">
                <ArrowLeftIcon className="w-6" />
              </Link>

              {
                selectedConversation.is_user && (
                  <UserAvatar user={selectedConversation} />
                )
              }

              {
                selectedConversation.is_group && (
                  <GroupAvatar />
                )
              }

              <div>
                <h3>{selectedConversation.name}</h3>

                {
                  isGroupConversation(selectedConversation) && (
                    <p className="text-xs text-gray-500">
                      {selectedConversation.users.length} members
                    </p>
                  )
                }
              </div>
            </div>

            {
              selectedConversation.is_group && (
                <div className="flex gap-3">
                  <GroupDescriptionPopover
                    description={isGroupConversation(selectedConversation) ? selectedConversation.description : ""}
                  />

                  <GroupUsersPopover
                    users={isGroupConversation(selectedConversation) ? selectedConversation.users : [] }
                  />

                  {
                    isGroupConversation(selectedConversation) && (selectedConversation.owner_id === user.id) && (
                      <>
                        <div className="tooltip tooltip-left" data-tip="Edit Group">
                          <button
                            onClick={() => emit('GroupModal.show', selectedConversation)}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            <PencilSquareIcon className="w-4" />
                          </button>
                        </div>

                        <div className="tooltip tooltip-left" data-tip="Delete Group">
                          <button
                            onClick={onDeleteGroup}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            <TrashIcon className="w-4" />
                          </button>
                        </div>
                      </>
                    )
                  }
                </div>
              )
            }
          </div>
        )
      }
    </>
  )
}

export default ConversationHeader