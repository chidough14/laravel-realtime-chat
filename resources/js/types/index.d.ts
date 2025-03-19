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
    attachments: any[]
    index: number
    show?: boolean
    onClose?: () => void
}

type AudioRecorderProps = {
    fileReady: (file: File, url: string) => void
}

type Conversation = {
    id: number;
    is_user?: boolean;
    is_group?: boolean;
};

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


export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
