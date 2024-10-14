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
    <div class="py-2 pl-4">
      <ElBreadcrumb separator="/">
        <ElBreadcrumbItem v-for="i in links" :key="i.code">
          <a @click.stop="gotoItem(i)">{{ i.name }}</a>
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </div>
    <div class="h-0 flex-1 w-full">
      <ElTable
        height="100%"
        v-loading="loading"
        :data="data.dataList"
        row-key="id"
      >
        <ElTableColumn
          type="index"
          label="序号"
          :index="index"
          width="120px"
        ></ElTableColumn>
        <ElTableColumn label="编码" prop="code" min-width="200px">
          <template #="{ row }">
            <ElLink type="primary" @click="pushLink(row)">{{
              row.code
            }}</ElLink>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="名称"
          prop="name"
          min-width="240px"
        ></ElTableColumn>
        <ElTableColumn label="父编码" prop="parentCode" min-width="200px" />
        <ElTableColumn label="描述" prop="desc" min-width="200px" />
        <ElTableColumn label="排序" prop="sort" width="80px"></ElTableColumn>
        <ElTableColumn label="是否可见" prop="visible">
          <template #default="{ row }">
            <ElSwitch
              :model-value="row.visible"
              @change="(e) => handleChangeVisible(e, row)"
            ></ElSwitch>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="200px">
          <template #="{ row }">
            <ElButton @click="openEditDialog(row)" type="primary"
              >编辑</ElButton
            >
            <ElPopconfirm
              :title="`是否删除文件 ”${row.name}“ ？`"
              @confirm="handleDeleteFile(row.id)"
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
  <Edit v-if="editRow" v-model="showEdit" :info="editRow" @done="load"></Edit>
</template>

<script setup lang="ts">
import { debounce, useLastAsync } from "@/hooks/useAsync";
import { usePagination, useTableIndex } from "@/hooks/usePagination";
import { pick } from "@/utils";
import Create from "./Create.vue";
import Edit from "./Edit.vue";
import { deleteDic, Dic, queryDict, updateDic } from "@/api/dic";
import { RES_CODE } from "@/const";
import { ElLink, ElMessage, vLoading } from "element-plus";

const links = ref([{ code: "", name: "root" }]);
let parentCode = "";
const pushLink = (row: Dic) => {
  links.value.push(pick(row, ["code", "name"]));
  parentCode = row.code;
  refreshEffect();
};
const gotoItem = (item: { code: string }) => {
  if (item.code === parentCode) {
    return;
  }

  const idx = links.value.findIndex((i) => i.code === item.code);
  links.value = links.value.slice(0, idx + 1);
  parentCode = links.value[links.value.length - 1].code;
  refreshEffect();
};

const name = ref("");
watch(
  name,
  debounce(() => {
    refreshEffect();
  })
);

const { data, load, loading } = useLastAsync(
  () => {
    return queryDict({
      ...pick(pager, ["pageNum", "pageSize"]),
      agreeVisible: true,
      parentCode: parentCode,
      name: name.value,
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

const { pager, refreshEffect } = usePagination(
  computed(() => data.value.total),
  load
);
load();

const showCreate = ref(false);
const openCreateDialog = () => {
  showCreate.value = true;
};

const showEdit = ref(false);
const editRow = ref<Dic>();
const openEditDialog = (row: Dic) => {
  editRow.value = { ...row };
  showEdit.value = true;
};

const index = useTableIndex(pager);
const handleChangeVisible = async (
  status: string | number | boolean,
  row: Dic
) => {
  const res = await updateDic(row.id, {
    visible: Boolean(status),
  });
  if (res.code !== RES_CODE.SUCCESS) {
    ElMessage.warning(res.message);
  } else {
    ElMessage.success(res.message);
  }
  load();
};

const handleDeleteFile = async (id: number) => {
  const res = await deleteDic(id);
  if (res.code !== RES_CODE.SUCCESS) {
    ElMessage.warning(res.message);
  } else {
    ElMessage.success(res.message);
  }
  load();
};
</script>

<style lang="scss" scoped></style>
