import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'toybox-build-notes';

export interface BuildNote {
  toyId: number;
  stepIndex: number;
  note: string;
  createdAt: number;
  updatedAt: number;
}

export interface BuildPhoto {
  toyId: number;
  stepIndex: number;
  dataUrl: string;
  createdAt: number;
}

interface NotesStorage {
  notes: BuildNote[];
  photos: BuildPhoto[];
}

function loadStorage(): NotesStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { notes: [], photos: [] };
  } catch {
    return { notes: [], photos: [] };
  }
}

function saveStorage(data: NotesStorage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore - might be quota exceeded
  }
}

export function useBuildNotes(toyId: number) {
  const [storage, setStorage] = useState<NotesStorage>(loadStorage);

  useEffect(() => {
    saveStorage(storage);
  }, [storage]);

  const getNote = useCallback(
    (stepIndex: number): string => {
      const note = storage.notes.find(
        (n) => n.toyId === toyId && n.stepIndex === stepIndex
      );
      return note?.note || '';
    },
    [storage.notes, toyId]
  );

  const setNote = useCallback(
    (stepIndex: number, note: string) => {
      setStorage((prev) => {
        const existing = prev.notes.find(
          (n) => n.toyId === toyId && n.stepIndex === stepIndex
        );
        if (existing) {
          return {
            ...prev,
            notes: prev.notes.map((n) =>
              n.toyId === toyId && n.stepIndex === stepIndex
                ? { ...n, note, updatedAt: Date.now() }
                : n
            ),
          };
        }
        return {
          ...prev,
          notes: [
            ...prev.notes,
            {
              toyId,
              stepIndex,
              note,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        };
      });
    },
    [toyId]
  );

  const getPhotos = useCallback(
    (stepIndex: number): BuildPhoto[] => {
      return storage.photos.filter(
        (p) => p.toyId === toyId && p.stepIndex === stepIndex
      );
    },
    [storage.photos, toyId]
  );

  const addPhoto = useCallback(
    (stepIndex: number, dataUrl: string) => {
      setStorage((prev) => ({
        ...prev,
        photos: [
          ...prev.photos,
          {
            toyId,
            stepIndex,
            dataUrl,
            createdAt: Date.now(),
          },
        ],
      }));
    },
    [toyId]
  );

  const removePhoto = useCallback(
    (stepIndex: number, createdAt: number) => {
      setStorage((prev) => ({
        ...prev,
        photos: prev.photos.filter(
          (p) =>
            !(p.toyId === toyId && p.stepIndex === stepIndex && p.createdAt === createdAt)
        ),
      }));
    },
    [toyId]
  );

  const getAllNotesForToy = useCallback(() => {
    return storage.notes.filter((n) => n.toyId === toyId);
  }, [storage.notes, toyId]);

  const getAllPhotosForToy = useCallback(() => {
    return storage.photos.filter((p) => p.toyId === toyId);
  }, [storage.photos, toyId]);

  const getTotalPhotosCount = useCallback(() => {
    return storage.photos.length;
  }, [storage.photos]);

  return {
    getNote,
    setNote,
    getPhotos,
    addPhoto,
    removePhoto,
    getAllNotesForToy,
    getAllPhotosForToy,
    getTotalPhotosCount,
  };
}
