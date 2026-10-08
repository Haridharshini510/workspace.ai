import { Request, Response } from "express";
import { Commitment } from "../models/Commitment.js";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
export async function getCommitments(req: Request, res: Response) {
  try {
    const items = await Commitment.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("Failed to retrieve commitments:", error);
    res.status(500).json({ error: "Failed to retrieve commitments" });
  }
}

export async function getCommitmentById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const item = await Commitment.findById(id);
    if(!item){
      res.status(404).json({ error: "Commitment not found" });
      return;
    }
    res.status(200).json(item);
  }
   catch (error) {
    console.error("Failed to retrieve commitment:", error);
    res.status(500).json({ error: "Failed to retrieve commitment" });
  }
}

export async function updateCommitmentById(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const item = await Commitment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!item) {
      res.status(404).json({ error: "Commitment not found" });
      return;
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Failed to update commitment:", error);
    res.status(500).json({ error: "Failed to update commitment" });
  }
  
}

export async function createCommitment(req: Request, res: Response) {
  try {
    const workspaceItemId = req.body.workspaceItemId;
    const workspacceItem = await WorkspaceItem.findById(workspaceItemId);
    if(!workspacceItem){
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }
    const item = await Commitment.create(req.body);

    res.status(201).json(item);
  } catch (error) {
    console.error("Failed to create commitment:", error);
    res.status(500).json({ error: "Failed to create commitment" });
  }
}

export async function deleteCommitmentById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const item = await Commitment.findByIdAndDelete(
      id
    );
    if(!item){
      res.status(404).json({ error: "Commitment not found" });
      return;
    }
    res.status(200).json(item);
  }
   catch (error) {
    console.error("Failed to delete commitment:", error);
    res.status(500).json({ error: "Failed to delete commitment" });
  }
}
