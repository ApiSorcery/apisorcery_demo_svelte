<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { UserModel, SelectOption, OperateType } from '@/types/common';
  import * as apiUser from '@/apis/auto/demo/ApiUser';
  import { message } from '@/utils/message';

  export let model: UserModel;
  export let operateType: OperateType;
  export let optionsMap: Record<string, SelectOption[]>;

  const dispatch = createEventDispatcher();

  let loading = false;
  let errors: Record<string, string> = {};
  let codeValidating = false;
  let fileInput: HTMLInputElement;
  let previewUrl = model.avatar || '';

  $: isViewMode = operateType === 'view';
  $: previewUrl = model.avatar || '';

  async function validateCode(code: string): Promise<boolean> {
    if (!code || operateType !== 'add') {
      return true;
    }

    codeValidating = true;
    try {
      const codeExists = await apiUser.validateCode({ code });
      if (codeExists) {
        errors.code = 'Code already exists';
        return false;
      }
      delete errors.code;
      return true;
    } catch (error) {
      console.error('Code validation error:', error);
      errors.code = 'Code validation failed, please try again';
      return false;
    } finally {
      codeValidating = false;
    }
  }

  function validateForm(): boolean {
    errors = {};

    if (!model.code) {
      errors.code = 'Cannot be empty';
    }
    if (!model.name) {
      errors.name = 'Cannot be empty';
    }
    if (!model.email) {
      errors.email = 'Cannot be empty';
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    if (!validateForm()) {
      return;
    }

    if (operateType === 'add') {
      const codeValid = await validateCode(model.code);
      if (!codeValid) {
        return;
      }
    }

    loading = true;
    try {
      if (model.id) {
        await apiUser.modifyUser({
          id: model.id,
          code: model.code,
          name: model.name,
          email: model.email,
          gender: model.gender,
          avatar: model.avatar,
          address: model.address,
          status: model.status,
        });
      } else {
        await apiUser.addUser({
          code: model.code,
          name: model.name,
          email: model.email,
          gender: model.gender,
          avatar: model.avatar,
          address: model.address,
          status: model.status,
        });
      }
      message.success('Saved successfully');
      dispatch('save');
    } catch (error) {
      console.error('Error saving form:', error);
      message.error('Failed to save');
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    dispatch('cancel');
  }

  function handleCodeBlur() {
    if (operateType === 'add' && model.code) {
      validateCode(model.code);
    }
  }

  function handleFileSelect() {
    fileInput.click();
  }

  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Check file size
    const size = Number((file.size / 1024 / 1024).toFixed(2));
    if (size > 10) {
      message.warning('File size exceeds limit (10MB), please select again!');
      return;
    }

    // Upload file
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_GLOB_BASE_API}/file/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.status === 0) {
        model.avatar = `${import.meta.env.VITE_GLOB_BASE_API}/file/${result.data}`;
        previewUrl = model.avatar;
        message.success('Upload successful');
      } else {
        message.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed');
    }
  }

  function handleRemoveImage() {
    model.avatar = '';
    previewUrl = '';
    if (fileInput) {
      fileInput.value = '';
    }
  }
</script>

<div class="user-form">
  <div class="form-grid">
    <div class="form-item">
      <label class="required">Code</label>
      <input
        type="text"
        bind:value={model.code}
        placeholder="Please enter"
        disabled={isViewMode || operateType !== 'add'}
        on:blur={handleCodeBlur}
        class:error={errors.code}
      />
      {#if errors.code}
        <span class="error-message">{errors.code}</span>
      {/if}
      {#if codeValidating}
        <span class="validating">Validating...</span>
      {/if}
    </div>

    <div class="form-item">
      <label class="required">Name</label>
      <input
        type="text"
        bind:value={model.name}
        placeholder="Please enter"
        disabled={isViewMode}
        class:error={errors.name}
      />
      {#if errors.name}
        <span class="error-message">{errors.name}</span>
      {/if}
    </div>

    <div class="form-item">
      <label class="required">Email</label>
      <input
        type="email"
        bind:value={model.email}
        placeholder="Please enter"
        disabled={isViewMode}
        class:error={errors.email}
      />
      {#if errors.email}
        <span class="error-message">{errors.email}</span>
      {/if}
    </div>

    <div class="form-item">
      <label>Gender</label>
      <div class="radio-group">
        {#each optionsMap.gender as option}
          <label class="radio-label">
            <input
              type="radio"
              bind:group={model.gender}
              value={option.value}
              disabled={isViewMode}
            />
            <span>{option.label}</span>
          </label>
        {/each}
      </div>
    </div>

    <div class="form-item full-width">
      <label>Address</label>
      <textarea
        bind:value={model.address}
        placeholder="Please enter"
        rows="3"
        disabled={isViewMode}
      />
    </div>

    <div class="form-item">
      <label>Avatar</label>
      <div class="upload-container">
        <input
          type="file"
          bind:this={fileInput}
          on:change={handleFileChange}
          accept="image/*"
          style="display: none;"
        />
        {#if previewUrl}
          <div class="image-preview">
            <img src={previewUrl} alt="avatar" />
            {#if !isViewMode}
              <button type="button" class="remove-btn" on:click={handleRemoveImage}>
                ×
              </button>
            {/if}
          </div>
        {:else if !isViewMode}
          <button type="button" class="upload-btn" on:click={handleFileSelect}>
            <span class="plus">+</span>
            <span>Upload</span>
          </button>
        {/if}
      </div>
    </div>

    <div class="form-item">
      <label>Enabled</label>
      <label class="switch">
        <input type="checkbox" bind:checked={model.status} disabled={isViewMode} />
        <span class="slider"></span>
      </label>
    </div>
  </div>

  <div class="form-actions">
    <button type="button" on:click={handleCancel}>Cancel</button>
    {#if !isViewMode}
      <button type="button" class="primary" on:click={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'OK'}
      </button>
    {/if}
  </div>
</div>

<style lang="scss">
  .user-form {
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .form-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      &.full-width {
        grid-column: 1 / -1;
      }

      label {
        font-size: 14px;
        color: #333;

        &.required::before {
          content: '* ';
          color: #ff4d4f;
        }
      }

      input[type='text'],
      input[type='email'],
      textarea {
        &.error {
          border-color: #ff4d4f;
        }
      }

      .error-message {
        color: #ff4d4f;
        font-size: 12px;
      }

      .validating {
        color: #1677ff;
        font-size: 12px;
      }

      .radio-group {
        display: flex;
        gap: 16px;

        .radio-label {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;

          input[type='radio'] {
            margin: 0;
          }

          span {
            font-size: 14px;
          }
        }
      }

      .upload-container {
        .upload-btn {
          width: 100px;
          height: 100px;
          border: 1px dashed #d9d9d9;
          background: #fafafa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #1677ff;
          }

          .plus {
            font-size: 24px;
            color: #999;
          }

          span {
            font-size: 12px;
            color: #999;
          }
        }

        .image-preview {
          position: relative;
          width: 100px;
          height: 100px;
          border: 1px solid #d9d9d9;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .remove-btn {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ff4d4f;
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            line-height: 1;

            &:hover {
              background: #ff7875;
            }
          }
        }
      }

      .switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 22px;

        input {
          opacity: 0;
          width: 0;
          height: 0;

          &:checked + .slider {
            background-color: #1677ff;
          }

          &:checked + .slider:before {
            transform: translateX(22px);
          }

          &:disabled + .slider {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.3s;
          border-radius: 22px;

          &:before {
            position: absolute;
            content: '';
            height: 18px;
            width: 18px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
          }
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }
  }
</style>
