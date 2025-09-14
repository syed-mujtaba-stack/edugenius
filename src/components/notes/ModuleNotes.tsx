'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Edit, Trash2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

interface Note {
  id: string;
  content: string;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function ModuleNotes({ moduleId, moduleTitle }: { moduleId: string; moduleTitle: string }) {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user, moduleId]);

  const loadNotes = async () => {
    // In a real app, fetch notes from your backend
    // This is mock data for demonstration
    setTimeout(() => {
      setNotes([
        {
          id: '1',
          content: 'Key concepts from this module...',
          moduleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }, 500);
  };

  const saveNote = async () => {
    if (!currentNote.trim()) return;

    setIsSaving(true);
    
    try {
      const newNote: Note = {
        id: editingNoteId || uuidv4(),
        content: currentNote,
        moduleId,
        createdAt: editingNoteId ? notes.find(n => n.id === editingNoteId)?.createdAt || new Date() : new Date(),
        updatedAt: new Date(),
      };

      // In a real app, save to your backend
      if (editingNoteId) {
        setNotes(notes.map(note => (note.id === editingNoteId ? newNote : note)));
      } else {
        setNotes([...notes, newNote]);
      }

      setCurrentNote('');
      setEditingNoteId(null);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = (id: string) => {
    // In a real app, delete from your backend
    setNotes(notes.filter(note => note.id !== id));
  };

  const editNote = (note: Note) => {
    setCurrentNote(note.content);
    setEditingNoteId(note.id);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notes for {moduleTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Write your notes here..."
            className="min-h-[120px]"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            {editingNoteId && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentNote('');
                  setEditingNoteId(null);
                }}
              >
                Cancel
              </Button>
            )}
            <Button onClick={saveNote} disabled={isSaving || !currentNote.trim()}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : editingNoteId ? 'Update Note' : 'Save Note'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <p className="whitespace-pre-line">{note.content}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editNote(note)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNote(note.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Last updated: {new Date(note.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
