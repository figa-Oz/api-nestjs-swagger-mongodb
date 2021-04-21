import { Document } from 'mongoose';

interface IViewer extends Document {
    user: string;
    ip: string;
    on_datetime: Date;
}

interface ILikes extends Document {
    user: string;
    ip: string;
    on_datetime: Date;
}

interface IShared extends Document {
    user: string;
    ip: string;
    to: string; // facebook | twitter | instagram | linkedin
    on_datetime: Date;
}

export interface IVideos extends Document {
    _id: any;
    title: string;
    url: string,
    comments: string[]
    viewer: IViewer[];
    likes: ILikes[];
    url_share: {
        twitter: string,
        facebook: string,
        linkedin: string
    },
    shared: IShared[];
}