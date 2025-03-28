import { Link, usePage } from "@inertiajs/react"
import UserAvatar from "./UserAvatar"
import GroupAvatar from "./GroupAvatar"
import UserOptionsDropdown from "./UserOptionsDropdown"
import { formatMessageDate } from "@/helpers"
import React from "react"
import { Conversation, ConversationItemProps, GroupConversation, UserConversation } from "@/types"


const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, selectedConversation = null, online = null }) => {
  // console.log(conversation)
  const page = usePage()
  const currentUser = page.props.auth.user
  let classes = " border-transparent"

  function isUserConversation (convo: Conversation): convo is UserConversation {
    return convo.is_user === true
  }

  function isGroupConversation (convo: Conversation): convo is GroupConversation {
    return convo.is_group === true
  }

  if (selectedConversation) {
    if (!isGroupConversation(selectedConversation) && !isGroupConversation(conversation) && selectedConversation.id == conversation.id) {
      classes = "border-blue-500 bg-black/20"
    }

    if (isGroupConversation(selectedConversation) && isGroupConversation(conversation) && selectedConversation.id == conversation.id) {
      classes = "border-blue-500 bg-black/20"
    }
  }

  return (
    <Link
      href={isGroupConversation(conversation) ? route('chat.group', conversation) : route('chat.user', conversation)}
      preserveState
      className={
        "conversation-item flex items-center mb-2 gap-2 text-gray-300 transition-all cursor-pointer border-l-4 hover:bg-black/30 "
        + classes + (conversation.is_user && currentUser.is_admin ? " pr-2" : " pr-4")
      }
    >
      {
        conversation.is_user && (
          <UserAvatar user={conversation} online={online} />
        )
      }

      {
        conversation.is_group && (
          <GroupAvatar />
        )
      }
      <div
        className={
          `flex-1 text-xs max-w-full overflow-hidden `
          + (isUserConversation(conversation) && conversation.blocked_at ? " opacity-50" : "")
        }
      >
        <div className="flex gap-1 justify-between items-center">
          <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
            {conversation.name}
          </h3>
          {
            conversation.last_message_date && (
              <span className="text-nowrap">
                {formatMessageDate(conversation.last_message_date, false)}
              </span>
            )
          }
        </div>

        {
          conversation.last_message && (
            <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
              {conversation.last_message}
            </p>
          )
        }
      </div>
      {
        currentUser.is_admin && isUserConversation(conversation) ? (
          <UserOptionsDropdown conversation={conversation} />
        ) : null
      }
    </Link>
  )
}

export default ConversationItem