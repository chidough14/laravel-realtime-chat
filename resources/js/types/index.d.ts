import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    is_admin?: boolean;
    avatar_url: string;
    created_at: string;
    last_message_date: string
    last_message: string
    updated_at: string
}

export interface AttachmentPreviewModalProps {
    attachments: Attachment[]
    index: number
    show?: boolean
    onClose?: () => void
}

type AudioRecorderProps = {
    fileReady: (file: File, url: string) => void
}

// type Conversation = {
//     id: number;
//     is_user?: boolean;
//     is_group?: boolean;
// };

type ChosenFile = {
    file: File;
    url: string;
};

type MessageInputProps = {
    conversation: Conversation | null;
};

type Attachment = {
    id: number;
    message_id: number;
    mime: string;
    name: string;
    size: number;
    url: string;
    type?: string
    created_at: string;
    updated_at: string;
};

type MessageAttachmentsProps = {
    attachments: Attachment[];
    attachmentClick: (attachments: Attachment[], index: number) => void;
};

type EventCallback = (data: any) => void

interface EventBus {
    emit: (name: string, data: any) => void
    on: (name: string, cb: EventCallback) => void
}

interface EventBusProviderProps {
    children: ReactNode
}

interface ToastMessage {
    message: string
    uuid: string
}

type Message = {
    id: number
    attachments: Attachment[]
    group_id: number
    created_at: string
    message: string
    receiver_id: number
    sender: User
    sender_id: number
    updated_at: string
}


type MessageOptionsDropdownProps = {
    message: Message
};

type NewMessageInputProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
};

// type Conversation = {
//     id: number;
//     name: string
//     description?: string
//     is_admin: boolean
//     is_group: boolean
//     is_user: boolean
//     owner_id?: number
//     users?: User[]
//     user_ids?: number[]
//     blocked_at: string
//     created_at: string
//     last_message: string
//     last_message_date: string
//     updated_at: string
// };

type BaseConversation = {
    id: number;
    name: string
    is_group: boolean
    is_user: boolean
    created_at: string
    last_message: string
    last_message_date: string
    updated_at: string
}

type UserConversation = BaseConversation & {
    is_admin: boolean
    blocked_at: string
}

type GroupConversation = BaseConversation & {
    description: string
    owner_id: number
    users: User[]
    user_ids: number[]
}

type Conversation = UserConversation | GroupConversation

type Conversations = Conversation[]

type ConversationItemProps = {
    conversation: Conversation 
    selectedConversation: Conversation
    online: boolean
}

type ModalProps = {
    show: boolean
    onClose: () => void
}

type UserPickerProps = {
    value: Conversation[]
    options: Conversation[]
    onSelect: (persons: Conversation[]) => void
}

type GroupModalFormData = {
    id: string
    name: string
    description: string
    user_ids: number[]
}

type UserModalFormData = {
    name: string
    email: string
    is_admin: boolean
}

type UpdateProfileFormData = {
    name: string
    avatar: File | null
    email: string
    _method: string
}

type UserAvatarProps = {
    user: any
    online?: boolean | null
    profile?: boolean
}


export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    conversations: Conversations
};

