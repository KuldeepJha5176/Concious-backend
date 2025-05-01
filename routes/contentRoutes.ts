import { ContentModel } from "../models";
import { fetchTwitter, fetchWebsite, fetchYoutubeMetaData, handleNote } from "../services/mediaHandlers";

export interface  youtubeMetaData {
    title: string;
    description: string;
    thumbnailUrl: string;
}

export const addContent = async (req: any, res: any) => {
    const { title, content, link } = req.body;
    try {
        let contentToSave = content || "";
        let titleToSave = title || "";
        let imageUrl : string | null = null;
        let metadata;

        if (link) {
            if(link.match(/youtube\.com|youtu\.be/i)){
                metadata = await fetchYoutubeMetaData(link);

            }
            else if(link.match(/twitter\.com|x\.com/i)){
                metadata = await fetchTwitter(link);
            }
            else {
                metadata = await fetchWebsite(link);
            }

            titleToSave = titleToSave || metadata.title;
            contentToSave = contentToSave || metadata.content;
            imageUrl = metadata.thumbnail;
        }
        else {
            metadata = await handleNote(titleToSave, contentToSave);
            titleToSave = metadata.title;
            contentToSave = metadata.content;

        }
        const timestamp = new Date().toISOString();
        const textForSave = `Title: ${titleToSave}\nDate: ${timestamp}\nContent: ${contentToSave}`;

        const newContent = await ContentModel.create({
            title: titleToSave,
            content: textForSave,
            link : link || "",
            type: link ? "link" : "note",
            imageUrl: imageUrl,
            tag: [],
            userId: req.user._id,
            createdAt: new Date(),
        });

        