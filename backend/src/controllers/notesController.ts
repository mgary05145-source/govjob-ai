import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, content, subject, tags, color } = req.body;
    const note = await prisma.note.create({
      data: { userId, title, content, subject, tags, color },
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { subject, search } = req.query;
    const where: any = { userId };
    if (subject && subject !== 'all') where.subject = subject;
    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { content: { contains: search as string } },
      ];
    }
    const notes = await prisma.note.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await prisma.note.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { title, content, subject, tags, color, isPinned } = req.body;
    const note = await prisma.note.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content, subject, tags, color, isPinned },
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    await prisma.note.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

export const generateAiSummary = async (req: Request, res: Response) => {
  try {
    const note = await prisma.note.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!note) return res.status(404).json({ error: 'Note not found' });

    const summary = note.content.substring(0, 200) + '...';
    const updated = await prisma.note.update({
      where: { id: note.id },
      data: { aiSummary: summary },
    });
    res.json({ summary: updated.aiSummary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};
