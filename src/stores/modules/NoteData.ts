import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import type { NoteStoreData, NoteData } from '@/types/note';
import { generateId } from '@/utils/storeUtil';

export default defineStore(
  'NoteData',
  () => {
    const state = reactive<NoteStoreData>({
      noteDataList: [
        {
          id: 1,
          title: 'Sample Title',
          content: 'Sample Content',
          updatedTime: new Date()
        },
        {
          id: 2,
          title: 'Sample two Title',
          content: 'Sample two Content',
          updatedTime: new Date()
        }
      ],
      displayNoteDetailData: null, // 这个字段不会持久化
      displayPicInPicNoteData: null // 这个字段不会持久化
    });

    function addNote({
      id,
      title,
      content
    }: {
      id?: number;
      title: string;
      content: string;
    }): void {
      const newNote: NoteData = {
        id: id || generateId(state.noteDataList),
        title,
        content,
        updatedTime: new Date()
      };
      pushNoteDataList(newNote);
    }

    function pushNoteDataList(newNote: NoteData) {
      state.noteDataList.push(newNote);
    }

    function deleteNote(id: number): void {
      const noteIndex = state.noteDataList.findIndex((note) => note.id === id);
      if (noteIndex !== -1) {
        state.noteDataList.splice(noteIndex, 1);
      }
    }

    function updateDisplayNoteDetailData(newNoteDetailData: NoteData | null): void {
      state.displayNoteDetailData = newNoteDetailData;
    }
    
    function updateDisplayPicInPicNoteData(newNoteDetailData: NoteData | null): void {
      state.displayPicInPicNoteData = newNoteDetailData;
    }

    function clearDisplayNoteDetail() {
      console.log("displayNoteDetailDatadisplayNoteDetailData");
      
      updateDisplayNoteDetailData(null);
    }

    function openNewNoteDetail() {
      const newNote: NoteData = {
        id: generateId(state.noteDataList),
        title: '',
        content: '',
        updatedTime: new Date()
      };
      updateDisplayNoteDetailData(newNote);
    }

    function updateOrAddNote({
      id,
      title,
      content
    }: {
      id: number;
      title?: string;
      content?: string;
    }): void {
      const noteIndex = state.noteDataList.findIndex((note) => note.id === id);
      const newNoteData: NoteData = {
        id,
        title: title || state.noteDataList[noteIndex].title,
        content: content || state.noteDataList[noteIndex].content,
        updatedTime: new Date()
      };
      if (noteIndex !== -1) {
        state.noteDataList[noteIndex] = newNoteData;
      } else {
        pushNoteDataList(newNoteData);
      }
    }

    return {
      ...toRefs(state),
      addNote,
      deleteNote,
      updateOrAddNote,
      updateDisplayNoteDetailData,
      clearDisplayNoteDetail,
      openNewNoteDetail,
      updateDisplayPicInPicNoteData
    };
  },

  {
    persist: {
      key: 'NoteData', // 持久化的键名
      storage: window.localStorage, // 使用 localStorage
      pick: ['noteDataList'] // 只持久化 noteDataList，忽略 displayNoteDetailData
    }
  }
);
