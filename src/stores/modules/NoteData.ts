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
          title: '备忘便签',
          content: "1. 吃饭\n2. 喝水\n3. 睡觉",
          updatedTime: new Date()
        },
        {
          id: 2,
          title: '学习',
          content: "1. 加法\n2. 减法\n3. 乘法\n4. 明天学除法",
          updatedTime: new Date()
        },
        {
          id: 3,
          title: '疑问',
          content: "1.  既然猪吃饲料，我们吃猪，为什么不直接吃饲料呢\n2. 空难的死亡率那么高，为什么飞机不在地上跑呢？\n3. 高考满分才750，那怎么才能考985\n4. 既然监狱里都是犯人，那警察叔叔为什么不去监狱里抓人？",
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
