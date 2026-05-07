<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { QueryModel, SelectOption } from '@/types/common';

  export let model: QueryModel;
  export let optionsMap: Record<string, SelectOption[]>;

  const dispatch = createEventDispatcher();

  function handleFilter() {
    dispatch('filter');
  }

  function handleReset() {
    dispatch('reset');
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleFilter();
    }
  }

  function handleExport() {
    dispatch('export');
  }
</script>

<div class="query-form">
  <div class="form-row">
    <div class="form-item">
      <label>Code</label>
      <input
        type="text"
        bind:value={model.code}
        placeholder="Please enter"
        on:keydown={handleKeyDown}
      />
    </div>

    <div class="form-item">
      <label>Name</label>
      <input
        type="text"
        bind:value={model.name}
        placeholder="Please enter"
        on:keydown={handleKeyDown}
      />
    </div>

    <div class="form-item">
      <label>Status</label>
      <select bind:value={model.status}>
        <option value={undefined}>Please select</option>
        {#each optionsMap.status as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <div class="form-actions">
      <button class="primary" on:click={handleFilter}>Search</button>
      <button on:click={handleReset}>Reset</button>
      <button on:click={handleExport}>Export</button>
    </div>
  </div>
</div>

<style lang="scss">
  .query-form {
    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .form-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      label {
        font-size: 14px;
        color: #333;
      }

      input,
      select {
        width: 200px;
      }
    }

    .form-actions {
      display: flex;
      gap: 8px;
    }
  }
</style>
