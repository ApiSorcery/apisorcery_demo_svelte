<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { UserModel, PaginationConfig, SelectOption } from '@/types/common';

  export let loading: boolean;
  export let dataSource: UserModel[];
  export let pagination: PaginationConfig;
  export let optionsMap: Record<string, SelectOption[]>;

  const dispatch = createEventDispatcher();

  function handleAdd() {
    dispatch('add');
  }

  function handleExport() {
    dispatch('export');
  }

  function handleView(user: UserModel) {
    dispatch('view', user);
  }

  function handleEdit(user: UserModel) {
    dispatch('edit', user);
  }

  function handleDelete(user: UserModel) {
    dispatch('delete', user);
  }

  function handlePageChange(page: number) {
    dispatch('pageChange', { page, pageSize: pagination.pageSize });
  }

  function handlePageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const pageSize = parseInt(target.value);
    dispatch('pageChange', { page: 1, pageSize });
  }

  function getStatusOption(value: any, options: SelectOption[]) {
    return options.find((opt) => opt.value === value);
  }

  $: totalPages = Math.ceil(pagination.total / pagination.pageSize);
  $: startIndex = (pagination.current - 1) * pagination.pageSize;
  $: endIndex = Math.min(startIndex + pagination.pageSize, pagination.total);
</script>

<div class="user-table">
  <div class="table-header">
    <h3>User Information</h3>
    <div class="header-actions">
      <button on:click={handleExport}>Export</button>
      <button class="primary" on:click={handleAdd}>Create</button>
    </div>
  </div>

  <div class="table-wrapper">
    {#if loading}
      <div class="loading">Loading...</div>
    {:else if dataSource.length === 0}
      <div class="empty">No data</div>
    {:else}
      <table>
        <thead>
          <tr>
            <th style="width: 60px;">No.</th>
            <th style="width: 120px;">Code</th>
            <th style="width: 100px;">Name</th>
            <th style="width: 180px;">Email</th>
            <th style="width: 120px;">Gender</th>
            <th style="width: 80px;">Avatar</th>
            <th style="width: 240px;">Address</th>
            <th style="width: 120px;">Status</th>
            <th style="width: 180px;">Last Modified</th>
            <th style="width: 180px;">Created</th>
            <th style="width: 160px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each dataSource as user, index}
            <tr>
              <td class="center">{startIndex + index + 1}</td>
              <td class="center">
                <button class="link" on:click={() => handleView(user)}>
                  {user.code}
                </button>
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {#if user.gender !== null && user.gender !== undefined}
                  {@const option = getStatusOption(user.gender, optionsMap.gender)}
                  {#if option}
                    <span class="tag" style="background-color: {option.color || '#f0f0f0'}">
                      {option.label}
                    </span>
                  {:else}
                    -
                  {/if}
                {:else}
                  -
                {/if}
              </td>
              <td class="center">
                {#if user.avatar}
                  <img src={user.avatar} alt="avatar" class="avatar" />
                {:else}
                  -
                {/if}
              </td>
              <td>{user.address || '-'}</td>
              <td>
                {#if user.status !== null && user.status !== undefined}
                  {@const option = getStatusOption(user.status, optionsMap.status)}
                  {#if option}
                    <span class="tag" style="background-color: {option.color || '#f0f0f0'}">
                      {option.label}
                    </span>
                  {:else}
                    -
                  {/if}
                {:else}
                  -
                {/if}
              </td>
              <td>{user.updatedAt}</td>
              <td>{user.createdAt}</td>
              <td class="actions">
                <div class="action-buttons">
                  {#if user.id && user.id >= 2}
                    <button
                      class="link"
                      on:click={() => handleEdit(user)}
                      disabled={user.id === 2}
                    >
                      Edit
                    </button>
                  {/if}
                  <button class="link danger" on:click={() => handleDelete(user)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <div class="pagination">
    <div class="pagination-info">
      Total {pagination.total} items
    </div>
    <div class="pagination-controls">
      <select on:change={handlePageSizeChange} value={pagination.pageSize}>
        <option value="10">10 / page</option>
        <option value="20">20 / page</option>
        <option value="50">50 / page</option>
        <option value="100">100 / page</option>
      </select>
      <button
        on:click={() => handlePageChange(pagination.current - 1)}
        disabled={pagination.current === 1}
      >
        Previous
      </button>
      <span class="page-info">
        {pagination.current} / {totalPages || 1}
      </span>
      <button
        on:click={() => handlePageChange(pagination.current + 1)}
        disabled={pagination.current >= totalPages}
      >
        Next
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  .user-table {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }
    }

    .table-wrapper {
      overflow-x: auto;
      border: 1px solid #f0f0f0;
      border-radius: 4px;

      .loading,
      .empty {
        padding: 40px;
        text-align: center;
        color: #999;
      }

      table {
        width: 100%;
        min-width: 1400px;
        border-collapse: collapse;

        thead {
          background: #fafafa;

          th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 500;
            color: #333;
            border-bottom: 1px solid #f0f0f0;
          }
        }

        tbody {
          tr {
            &:hover {
              background: #fafafa;
            }

            td {
              padding: 12px 8px;
              border-bottom: 1px solid #f0f0f0;
              color: #666;

              &.center {
                text-align: center;
              }

              &.actions {
                text-align: center;

                .action-buttons {
                  display: inline-flex;
                  gap: 8px;
                  align-items: center;
                }
              }
            }
          }
        }
      }

      .link {
        background: none;
        border: none;
        color: #1677ff;
        cursor: pointer;
        padding: 0;
        font-size: 14px;

        &:hover {
          text-decoration: underline;
        }

        &.danger {
          color: #ff4d4f;
        }

        &:disabled {
          color: #ccc;
          cursor: not-allowed;
          text-decoration: none;
        }
      }

      .tag {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        color: white;
      }

      .avatar {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
      }
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;

      .pagination-info {
        color: #666;
        font-size: 14px;
      }

      .pagination-controls {
        display: flex;
        gap: 8px;
        align-items: center;

        select {
          padding: 4px 8px;
        }

        button {
          padding: 4px 12px;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }

        .page-info {
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
</style>
