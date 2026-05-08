<script lang="ts">
  import { onMount } from 'svelte';
  import type { SelectOption, QueryModel, UserModel, PaginationConfig, OperateType } from '@/types/common';
  import * as apiUser from '@/apis/auto/demo/ApiUser';
  import dayjs from '@/utils/dayjs';
  import { message } from '@/utils/message';
  import QueryForm from './components/QueryForm.svelte';
  import UserTable from '@/components/UserTable.svelte';
  import UserModal from './components/UserModal.svelte';

  // Options
  const optionsMap: Record<string, SelectOption[]> = {
    gender: [
      { value: 0, label: 'Unknown' },
      { value: 1, label: 'Male' },
      { value: 2, label: 'Female' },
    ],
    status: [
      { value: false, label: 'Disabled', color: 'gray' },
      { value: true, label: 'Enabled', color: '#1677ff' },
    ],
  };

  // Query state
  let queryModel: QueryModel = {
    code: '',
    name: '',
  };

  // Table state
  let loading = false;
  let dataSource: UserModel[] = [];
  let pagination: PaginationConfig = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  // Modal state
  let modalVisible = false;
  let operateType: OperateType = 'add';
  let formModel: UserModel = {
    code: '',
    name: '',
    email: '',
    gender: undefined,
    avatar: '',
    address: '',
    status: false,
  };

  // Load user list
  async function getList() {
    console.log('getList', pagination, queryModel);
    loading = true;
    try {
      const res = await apiUser.getUserPaged({
        pagination: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
        ...queryModel,
      });
      dataSource = (res.results || []).map((r) => ({
        ...r,
        createdAt: dayjs(r.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(r.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      }));
      pagination.total = res.total || 0;
    } catch (error) {
      console.error('Error fetching user list:', error);
      message.error('Failed to fetch user list');
    } finally {
      loading = false;
    }
  }

  // Query handlers
  function handleFilter() {
    console.log('handleFilter', queryModel);
    pagination.current = 1;
    getList();
  }

  function handleReset() {
    console.log('handleReset');
    queryModel = { code: '', name: '' };
    pagination.current = 1;
    getList();
  }

  // Table handlers
  function handlePageChange(page: number, pageSize: number) {
    pagination.current = page;
    pagination.pageSize = pageSize;
    getList();
  }

  function handleAdd() {
    console.log('handleAdd');
    operateType = 'add';
    formModel = {
      code: '',
      name: '',
      email: '',
      gender: undefined,
      avatar: '',
      address: '',
      status: false,
    };
    modalVisible = true;
  }

  function handleView(user: UserModel) {
    console.log('handleView', user);
    operateType = 'view';
    formModel = { ...user };
    modalVisible = true;
  }

  function handleEdit(user: UserModel) {
    console.log('handleEdit', user);
    operateType = 'edit';
    formModel = { ...user };
    modalVisible = true;
  }

  async function handleDelete(user: UserModel) {
    console.log('handleDelete', user);
    if (!confirm('This operation will permanently delete the data. Do you want to continue?')) {
      message.info('Delete cancelled');
      return;
    }

    try {
      await apiUser.removeUser({ id: user.id! });
      message.success('Deleted successfully!');
      getList();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  }

  async function handleExport() {
    console.log('handleExport', queryModel);
    try {
      message.loading({ content: 'Exporting...', key: 'export', duration: 0 });
      const response = await apiUser.exportUsers({
        code: queryModel.code || '',
        name: queryModel.name || '',
        email: '',
      });

      // Create download link
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.name || `users_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.destroy('export');
      message.success('Export completed successfully!');
    } catch (error) {
      message.destroy('export');
      message.error('Export failed, please try again');
      console.error('Export error:', error);
    }
  }

  // Modal handlers
  function handleModalClose() {
    modalVisible = false;
  }

  function handleModalSave() {
    modalVisible = false;
    getList();
  }

  // Load data on mount
  onMount(() => {
    getList();
  });
</script>

<div class="user-page">
  <div class="query-container">
    <QueryForm
      bind:model={queryModel}
      {optionsMap}
      on:filter={handleFilter}
      on:reset={handleReset}
      on:export={handleExport}
    />
  </div>

  <div class="table-container">
    <UserTable
      {loading}
      {dataSource}
      {pagination}
      {optionsMap}
      on:add={handleAdd}
      on:view={(e) => handleView(e.detail)}
      on:edit={(e) => handleEdit(e.detail)}
      on:delete={(e) => handleDelete(e.detail)}
      on:pageChange={(e) => handlePageChange(e.detail.page, e.detail.pageSize)}
    />
  </div>

  {#if modalVisible}
    <UserModal
      {operateType}
      bind:model={formModel}
      {optionsMap}
      on:close={handleModalClose}
      on:save={handleModalSave}
    />
  {/if}
</div>

<style lang="scss">
  .user-page {
    padding: 12px;
    min-height: 100vh;

    .query-container {
      background: white;
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 4px;
    }

    .table-container {
      background: white;
      padding: 12px;
      border-radius: 4px;
    }
  }
</style>
