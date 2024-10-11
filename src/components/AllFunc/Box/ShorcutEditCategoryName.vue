<template>
  <n-modal
    class="Shorcut-Edit__modal"
    preset="card"
    v-model:show="show"
    title="编辑导航分类名称"
    :bordered="false"
    @mask-click="handleCloseEditCategoryName"
  >
    <n-form
      :rules="editCategoryNameFormRules"
      :model="editCategoryNameFormValues"
      :label-width="80"
    >
      <n-form-item label="导航分类名称" path="">
        <n-input
          clearable
          show-count
          maxlength="14"
          v-model:value="editCategoryNameFormValues.selectCategoryName"
          placeholder="请输入导航分类名称"
        />
      </n-form-item>
    </n-form>
    <template #footer>
      <n-space justify="end">
        <n-button strong secondary @click="handleCloseEditCategoryName">取消</n-button>
        <n-button
          strong
          secondary
          @click="handleSaveEditCategoryName(editCategoryNameFormValues.selectCategoryName)"
        >
          保存
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script setup lang="ts">
import { NModal, NInput, NButton } from 'naive-ui';
import { siteStore } from '@/stores';
const site = siteStore();

let show = defineModel('show', { type: Boolean });

interface Props {
  preSelectCategoryName: string;
}

const props = withDefaults(defineProps<Props>(), {
  preSelectCategoryName: ''
});

let editCategoryNameFormValues = ref({
  selectCategoryName: ''
});

watch(
  () => show,
  () => {
    editCategoryNameFormValues.value.selectCategoryName = props.preSelectCategoryName;
  }
);

//编辑CategoryName
const editCategoryNameFormRules = {
  selectCategoryName: {
    required: true,
    message: '请输入导航分类名称',
    trigger: ['input', 'blur']
  }
};

function handleCloseEditCategoryName() {
  show.value = false;
}
function handleSaveEditCategoryName(newCategoryName: string) {
  const categoryData = site.findCategoryData(props.preSelectCategoryName);
  categoryData && (categoryData.categoryName = newCategoryName);
  handleCloseEditCategoryName();
}

//编辑CategoryName End
</script>
<style lang="scss" scoped>
.Shorcut-Edit__modal {
  .n-button + .n-button {
    margin-left: 10px;
  }
}
</style>
