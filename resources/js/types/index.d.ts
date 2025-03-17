import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    is_admin?: boolean
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

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
