<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { UserModel, SelectOption, OperateType } from '@/types/common';
  import UserForm from '@/components/UserForm.svelte';

  export let operateType: OperateType;
  export let model: UserModel;
  export let optionsMap: Record<string, SelectOption[]>;

  const dispatch = createEventDispatcher();

  $: title = operateType === 'add' ? 'Create User' : operateType === 'edit' ? 'Edit User' : 'View User';

  function handleClose() {
    dispatch('close');
  }

  function handleSave() {
    dispatch('save');
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
</script>

<div class="modal-backdrop" on:click={handleBackdropClick}>
  <div class="modal-content">
    <div class="modal-header">
      <h2>{title}</h2>
      <button class="close-btn" on:click={handleClose}>×</button>
    </div>
    <div class="modal-body">
      <UserForm
        {model}
        {operateType}
        {optionsMap}
        on:save={handleSave}
        on:cancel={handleClose}
      />
    </div>
  </div>
</div>

<style lang="scss">
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;

      &:hover {
        color: #333;
      }
    }
  }

  .modal-body {
    padding: 24px;
    overflow-y: auto;
  }
</style>
