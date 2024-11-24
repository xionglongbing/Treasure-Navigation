export  interface NoteStoreData {
    noteDataList: NoteData[],
    displayNoteDetailData: NoteData | null,
    displayPicInPicNoteData: NoteData | null,
}
export interface NoteData {
    id: number,
    title: string,
    content: string,
    updatedTime?: Date
}