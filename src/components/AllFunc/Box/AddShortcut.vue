<template>
  <n-modal
    preset="card"
    v-model:show="isVisible"
    :mask-closable="false"
    :title="`${props.isEditMode ? '编辑' : '添加'}导航`"
    :bordered="false"
  >
    <n-form
      class="add-shortcut__form"
      ref="formRef"
      :rules="formRules"
      :model="formValues"
      :label-width="80"
    >
      <n-form-item label="导航分类" path="categoryName">
        <n-select
          placeholder="可自定义输入分类"
          v-model:value="formValues.categoryName"
          filterable
          tag
          clearable
          :options="categoryOptions"
          :disabled="isEditMode"
        />
      </n-form-item>
      <n-form-item :label="isBatchAdd ? '导航名称1' : '导航名称'" path="websiteData.name">
        <n-input
          clearable
          show-count
          maxlength="14"
          v-model:value="formValues.websiteData.name"
          placeholder="请输入导航名称"
        />
      </n-form-item>
      <n-form-item :label="isBatchAdd ? '站点链接1' : '站点链接'" path="websiteData.url">
        <n-input
          clearable
          v-model:value="formValues.websiteData.url"
          placeholder="请输入导航链接"
        />
      </n-form-item>
      <template v-if="isBatchAdd">
        <template v-for="item in site.batchAddCount - 1" :key="item">
          <n-form-item :label="'导航名称' + (item + 1)">
            <n-input
              clearable
              show-count
              maxlength="14"
              v-model:value="batchAddFormValues[item].name"
              placeholder="请输入导航名称(非必填)"
            />
          </n-form-item>
          <n-form-item :label="'站点链接' + (item + 1)">
            <n-input
              clearable
              v-model:value="batchAddFormValues[item].url"
              placeholder="请输入导航链接(非必填)"
            />
          </n-form-item>
        </template>
      </template>
    </n-form>
    <template #footer>
      <n-space justify="space-between">
        <div class="footer__btn-group">
          <n-button strong secondary @click="closeModal">导入文件</n-button>
          <n-button strong secondary @click="handleBatchAdd(!isBatchAdd)">{{
            isBatchAdd ? '取消批量添加' : '批量添加'
          }}</n-button>
        </div>
        <div class="footer__btn-group">
          <n-button strong secondary @click="closeModal">取消</n-button>
          <n-button strong secondary @click="handleSubmit">
            {{ props.isEditMode ? '编辑' : '添加' }}
          </n-button>
        </div>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NButton, NForm, NFormItem, NInput, NSelect, NSpace, NModal } from 'naive-ui';
import { ElMessage } from 'element-plus';
import { siteStore } from '@/stores';
import identifyInput from '@/utils/identifyInput';
import type { WebsiteDataInfo, WebsiteData } from '@/stores/types/type';

// Props and emit setup
const props = defineProps({
  modelValue: Boolean,
  isEditMode: Boolean,
  editValue: {
    type: Object as () => WebsiteDataInfo | null,
    default: null
  }
});
const emit = defineEmits([
  'update:model-value',
  'updateShortcut',
  'clearSelectedShortcut',
  'handleAddOrEditShortcut',
  'handleBatchAddShortcut'
]);

// 控制 modal 显示
const isVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:model-value', val);
    val || emit('clearSelectedShortcut');
  }
});

// 获取站点数据
const site = siteStore();

// 分类选项
const categoryOptions = computed(() =>
  site.categoryNameList.map((item) => ({ label: item, value: item }))
);

// // 用于控制表单提交类型：false为添加，true为编辑
// const isEditMode = ref(!!props.editValue);

// 表单初始值
watch(
  () => props.modelValue,
  (val: boolean) => {
    if (val) {
      setDefaultFormValues();
    }
  }
);

let formValues = ref<WebsiteDataInfo>({ categoryName: '', websiteData: { name: '', url: '' } });

function setDefaultFormValues() {
  formValues.value = props.editValue || { categoryName: '', websiteData: { name: '', url: '' } };
}

// 表单验证规则
const formRules = {
  categoryName: {
    required: true,
    message: '请选择或输入导航分类',
    trigger: ['input', 'blur']
  },
  'websiteData.name': {
    required: true,
    message: '请输入导航名称',
    trigger: ['input', 'blur']
  },
  'websiteData.url': {
    required: true,
    validator(rule: any, value: string) {
      if (!value) {
        return new Error('请输入站点链接');
      } else if (identifyInput(value) !== 'url') {
        return new Error('请检查是否为正确的网址');
      }
      return true;
    },
    trigger: ['input', 'blur']
  }
};

// 表单引用
const formRef = ref();

let isBatchAdd = ref();
let batchAddFormValues = ref<WebsiteData[]>([]);
// 批量处理添加
function handleBatchAdd(bol: Boolean) {
  isBatchAdd.value = bol;
  setBatchAddFormValues(site.batchAddCount);
}
// 初始化批量处理的数目
function setBatchAddFormValues(count: number) {
  batchAddFormValues.value.length = count;
  batchAddFormValues.value = [];
  for (let i = 0; i < count; i++) {
    batchAddFormValues.value.push({
      name: '',
      url: ''
    });
  }
}

// 关闭 modal 并重置表单
const closeModal = () => {
  isVisible.value = false;
};

// 提交表单，添加或编辑导航
const handleSubmit = () => {
  if (judgeFormValues() === 'next') {
    if (isBatchAdd.value) {
      emit(
        'handleBatchAddShortcut',
        formValues.value.categoryName,
        formValues.value.websiteData,
        batchAddFormValues.value
      );
    } else {
      emit('handleAddOrEditShortcut', formValues.value.categoryName, formValues.value.websiteData);
    }
  }
};
function judgeFormValues() {
  formRef.value?.validate((errors: any) => {
    console.log('errors', errors);
    if (errors) {
      ElMessage.error('请检查您的输入');
      return;
    }
  });
  return 'next';
}
</script>
<style lang="scss" scoped>
.add-shortcut__form {
  max-height: 30rem;
  overflow-y: auto;
  padding-right: 24px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: var(--main-scrollbar-color);
  }
}
.footer__btn-group {
  button + button {
    margin-left: 8px;
  }
}
</style>
<style>
.n-card > .n-card__content {
  padding-right: 0;
}
</style>
