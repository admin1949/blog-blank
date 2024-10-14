<template>
  <div class="h-full w-full flex flex-col gap-2 p-2">
    <div>
      <ElForm inline>
        <ElFormItem>
          <ElButton @click="openCreateDialog" type="primary">新增</ElButton>
        </ElFormItem>
        <ElFormItem>
          <ElInput
            class="!w-[400px]"
            clearable
            v-model="name"
            placeholder="请输入名称"
          ></ElInput>
        </ElFormItem>
      </ElForm>
    </div>
    <div class="h-0 flex-1 w-full">
      <ElTable
        height="100%"
        v-loading="loading"
        :data="data.dataList"
        row-key="id"
      >
        <ElTableColumn
          :index="index"
          type="index"
          label="序号"
          width="80px"
        ></ElTableColumn>
        <ElTableColumn prop="title" label="标题"></ElTableColumn>
        <ElTableColumn prop="title" width="180px" center label="封面">
          <template #="{ row }">
            <ImageItem :src="buildFilePath(row.avatar)"></ImageItem>
          </template>
        </ElTableColumn>
        <ElTableColumn label="标签">
          <template #="{ row }">
            <TagList
              :enum-key="REMOTE_ENUMS.TYPE_TAG"
              :keys="row.tags"
            ></TagList>
          </template>
        </ElTableColumn>
        <ElTableColumn label="技术标签">
          <template #="{ row }">
            <TagList
              :enum-key="REMOTE_ENUMS.SKILL_TAG"
              :keys="row.skillTags"
            ></TagList>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="desc"
          min-width="320px"
          label="标题"
        ></ElTableColumn>
        <ElTableColumn prop="title" width="180px" center label="详情图片">
          <template #="{ row }">
            <ImageItem
              v-if="row.pics.length"
              :src="buildFilePath(row.pics[0])"
            ></ImageItem>
          </template>
        </ElTableColumn>
        <ElTableColumn label="是否可见" prop="visible">
          <template #default="{ row }">
            <ElSwitch
              :model-value="row.visible"
              @change="(e) => handleChangeVisible(e, row.id)"
            ></ElSwitch>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" min-width="200px">
          <template #="{ row }">
            <ElButton @click="openEditDialog(row)">编辑</ElButton>
            <ElPopconfirm
              :title="`是否删除 ”${row.title}“ ？`"
              @confirm="handleDeleteBlog(row.id)"
              width="240"
            >
              <template #reference>
                <ElButton plain type="warning">删除</ElButton>
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
    <div class="flex justify-end">
      <ElPagination
        v-model:current-page="pager.pageNum"
        v-model:page-size="pager.pageSize"
        :page-sizes="pager.pageSizes"
        :total="pager.total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
  <Create v-model="showCreate" @done="load"></Create>
  <Edit v-if="editInfo" v-model="showEdit" :info="editInfo"></Edit>
</template>

<script setup lang="ts">
import { deleteBlog, queryBlogList, updateBlog } from "@/api/blog";
import { debounce, useLastAsync } from "@/hooks/useAsync";
import { usePagination, useTableIndex } from "@/hooks/usePagination";
import { pick, viewResMessage } from "@/utils";
import Create from "./Create.vue";
import Edit from "./Edit.vue";
import { vLoading } from "element-plus";
import { REMOTE_ENUMS } from "@/enums/remoteEnums";
import { BlogVO } from "blank-admin/src/blog/blog.type";
import { buildFilePath } from "@/utils/fs";

const name = ref("");
const { data, load, loading } = useLastAsync(
  () => {
    return queryBlogList({
      ...pick(pager, ["pageNum", "pageSize"]),
      content: name.value,
    });
  },
  (res) => {
    return res
      ? res.data
      : {
          dataList: [],
          total: 0,
        };
  }
);
watch(
  name,
  debounce(() => {
    refreshEffect();
  })
);

const showCreate = ref(false);
const openCreateDialog = () => {
  showCreate.value = true;
};

const editInfo = ref<BlogVO>();
const showEdit = ref(false);
const openEditDialog = (row: BlogVO) => {
  editInfo.value = { ...row };
  showEdit.value = true;
};

const { pager, refreshEffect } = usePagination(
  computed(() => data.value.total),
  load
);
const index = useTableIndex(pager);
load();

const handleDeleteBlog = async (id: number) => {
  const res = await deleteBlog(id);
  if (!viewResMessage(res)) {
    return;
  }
  load();
};
const handleChangeVisible = async (
  status: string | number | boolean,
  id: number
) => {
  const res = await updateBlog(id, {
    visible: Boolean(status),
  });
  if (!viewResMessage(res)) {
    return;
  }
  load();
};
</script>

<style lang="scss" scoped></style>
