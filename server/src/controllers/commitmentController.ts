import { Request, Response } from "express";
import { Commitment } from "../models/Commitment.js";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
import { generateCommitment } from "../services/commitmentGenerationService.js";
export async function getCommitments(req: Request, res: Response) {
  try {
    const filter: Record<string, any> = { userId: req.userId };
    if (req.query.workspaceItemId) filter.workspaceItemId = req.query.workspaceItemId as string;
    if (req.query.status) filter.status = req.query.status as string;
    if (req.query.priority) filter.priority = req.query.priority as string;

    const items = await Commitment.find(filter);
    res.status(200).json(items);
  } catch (error) {
    console.error("Failed to retrieve commitments:", error);
    res.status(500).json({ error: "Failed to retrieve commitments" });
  }
}

export async function getCommitmentById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const item = await Commitment.findOne({ _id: id, userId: req.userId });
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

    const item = await Commitment.findOneAndUpdate(
      { _id: id, userId: req.userId },
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
    const workspacceItem = await WorkspaceItem.findOne({ _id: workspaceItemId, userId: req.userId });
    if(!workspacceItem){
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }
    const item = await Commitment.create({
      ...req.body,
      userId: req.userId,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Failed to create commitment:", error);
    res.status(500).json({ error: "Failed to create commitment" });
  }
}

export async function deleteCommitmentById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const item = await Commitment.findOneAndDelete({ _id: id, userId: req.userId });
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

export async function getCommitmentsByWorkspaceItem(req: Request, res: Response) {
  try {
    const workspaceItemId = req.params.id;
    const workspaceItem = await WorkspaceItem.findOne({ _id: workspaceItemId, userId: req.userId });
    if (!workspaceItem) {
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }
    const commitments = await Commitment.find({ workspaceItemId, userId: req.userId });
    res.status(200).json(commitments);
  } catch (error) {
    console.error("Failed to retrieve commitments for workspace item:", error);
    res.status(500).json({ error: "Failed to retrieve commitments for workspace item" });
  }
}

export async function generateCommitmentForWorkspaceItem(req: Request, res: Response) {
  try {
    const workspaceItemId = req.params.id;
    const workspaceItem = await WorkspaceItem.findOne({ _id: workspaceItemId, userId: req.userId });
    if (!workspaceItem) {
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }
    const result = await generateCommitment(workspaceItem);

const statusCode = result.outcome === "created" ? 201 : 200;

res.status(statusCode).json(result);
  } catch (error) {
    console.error("Failed to generate commitment:" , error);
    res.status(500).json({ error: "Failed to generate commitment" });
  }
}
