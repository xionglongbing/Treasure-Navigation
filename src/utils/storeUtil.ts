import type { NoteData } from '@/types/note';

let nextId = 1; // 初始 ID，从 1 开始

export function generateId(NoteDataList: NoteData[]): number {
    const existingIds = new Set(NoteDataList.map(note => note.id));
    
    while (existingIds.has(nextId)) {
        nextId++;
    }
    
    return nextId++;
}
