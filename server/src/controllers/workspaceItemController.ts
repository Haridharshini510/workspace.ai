import { Request, Response } from "express";
import { WorkspaceItem } from "../models/WorkspaceItem.js";
import { determineActionability } from "../services/actionabilityService.js";
import { syncCommitmentFromWorkspaceItem } from "../services/commitmentSyncService.js";
export async function getWorkspaceItems(req: Request, res: Response) {
  try {
    const items = await WorkspaceItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("Failed to retrieve workspace items:", error);
    res.status(500).json({ error: "Failed to retrieve workspace items" });
  }
}

export async function getWorkspaceItemById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const item = await WorkspaceItem.findById(id);
    if(!item){
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }
    res.status(200).json(item);
  }
   catch (error) {
    console.error("Failed to retrieve workspace item:", error);
    res.status(500).json({ error: "Failed to retrieve workspace item" });
  }
}

export async function updateWorkspaceItemById(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const item = await WorkspaceItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    
    if (!item) {
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }
    await syncCommitmentFromWorkspaceItem(item);

    res.status(200).json(item);
  } catch (error) {
    console.error("Failed to update workspace item:", error);
    res.status(500).json({ error: "Failed to update workspace item" });
  }
  
}

export async function createWorkspaceItem(req: Request, res: Response) {
  try {
    const item = await WorkspaceItem.create(req.body);

    res.status(201).json(item);
  } catch (error) {
    console.error("Failed to create workspace item:", error);
    res.status(500).json({ error: "Failed to create workspace item" });
  }
}

export async function deleteWorkspaceItemById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const item = await WorkspaceItem.findByIdAndDelete(
      id
    );
    if(!item){
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }
    res.status(200).json(item);
  }
   catch (error) {
    console.error("Failed to delete workspace item:", error);
    res.status(500).json({ error: "Failed to delete workspace item" });
  }
}

export async function getWorkspaceItemActionability(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const item = await WorkspaceItem.findById(id);
    if (!item) {
      res.status(404).json({ error: "Workspace item not found" });
      return;
    }
    const actionability = determineActionability(item);
    res.status(200).json(actionability);
  } catch (error) {
    console.error("Failed to retrieve workspace item actionability:", error);
    res.status(500).json({ error: "Failed to retrieve workspace item actionability" });
  }
}