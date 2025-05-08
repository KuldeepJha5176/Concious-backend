import type { Response } from "express";
import mongoose from "mongoose";
import { ContentModel } from "../models";
import type { AuthRequest } from "../types";
import { getPineconeIndex } from "../config/pinecone";
import { getEmbedding } from "../services/embedding";

import {
  fetchYouTube,
  fetchTwitter,
  fetchWebsite,
  handleNote,
} from "../services/mediaHandlers";

export const addContent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { link, title, content } = req.body;

  try {
    let contentToSave = content || "";
    let titleToSave = title || "";
    let imageUrl: string | null = null;
    let metadata;

    if (link) {
      try {
        if (link.match(/youtube\.com|youtu\.be/i)) {
          metadata = await fetchYouTube(link);
        } else if (link.match(/twitter\.com|x\.com/i)) {
          metadata = await fetchTwitter(link);
        } else {
          metadata = await fetchWebsite(link);
        }
      } catch (mediaError) {
        console.error("Media processing error:", mediaError);
        res.status(422).json({ 
          message: "Could not process the provided link",
          error: mediaError instanceof Error ? mediaError.message : String(mediaError)
        });
        return;
      }

      titleToSave = titleToSave || metadata.title;
      contentToSave = metadata.content;
      imageUrl = metadata.thumbnail;
    } else {
      metadata = await handleNote(titleToSave, contentToSave);
      titleToSave = metadata.title;
      contentToSave = metadata.content;
    }

    // Create content document in MongoDB
    let newContent;
    try {
      newContent = await ContentModel.create({
        title: titleToSave,
        link: link || null,
        type: link ? "Url" : "Note",
        content: contentToSave,
        imageUrl,
        tag: [],
        userId: req.userId,
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).json({ 
        message: "Failed to save content to database", 
        error: dbError instanceof Error ? dbError.message : String(dbError)
      });
      return;
    }

    // Create vector embedding and save to Pinecone
    try {
      const timestamp = new Date().toLocaleString();
      const textForEmbedding = `Title: ${titleToSave}\nDate: ${timestamp}\nContent: ${contentToSave}`;
      const embedding = await getEmbedding(textForEmbedding);
      
      const pineconeIndex = getPineconeIndex();
      await pineconeIndex.upsert([
        {
          id: newContent._id.toString(),
          values: embedding,
          metadata: {
            userId: req.userId?.toString() || "",
            title: titleToSave,
            contentType: link ? "Url" : "Note",
            timestamp,
            snippet: contentToSave.substring(0, 100),
            imageUrl: imageUrl || "",
          },
        },
      ]);
      console.log("Successfully added vector to Pinecone");
    } catch (vectorError) {
      // If Pinecone operation fails, we still keep the content in MongoDB
      console.error("Vector store error:", vectorError);
      
      // If it's a dimension mismatch error, provide a clearer message
      if (vectorError instanceof Error && 
          vectorError.message.includes("Vector dimension") && 
          vectorError.message.includes("does not match")) {
        console.error("Dimension mismatch detected in Pinecone operation");
      }
      
      // We don't return an error to the client since the content was saved successfully
      // But we do log the issue for the server admin to address
    }

    res.status(200).json({
      message: "Content added successfully",
      contentId: newContent._id,
      imageUrl,
    });
  } catch (err) {
    console.error("Error adding content:", err);
    res.status(500).json({ 
      message: "Internal server error",
      error: err instanceof Error ? err.message : String(err)
    });
  }
};
export const getContent = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  try {
    const content = await ContentModel.find({ userId: userId }).populate(
      "userId",
      "username"
    );
    if (content.length == 0) {
      res.json({
        content: [
          {
            _id: "default-1",
            type: "Note",
            title: "Welcome to Conscious!",
            content:
              "This is your default content. Start exploring now! click on Add Memory to add more content",
            imageUrl: null,
            createdAt: Date.now()
          },
        ],
      });
      return;
    }
    res.status(200).json({
      content: content.map((item) => ({
        _id: item._id,
        title: item.title,
        type: item.type,
        content: item.content,
        link: item.link || null,
        imageUrl: item.imageUrl || null, 
        userId: item.userId,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteContent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { contentId } = req.params;

  if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
    res.status(400).json({ error: "Invalid or missing content ID" });
    return;
  }

  try {
   
    await ContentModel.deleteOne({ _id: contentId, userId: req.userId });
    // Delete from Pinecone
    const pineconeIndex = getPineconeIndex();
    await pineconeIndex.deleteOne(contentId);

    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ message: "Error deleting content" });
  }
};