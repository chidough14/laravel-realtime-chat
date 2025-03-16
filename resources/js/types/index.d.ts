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

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
