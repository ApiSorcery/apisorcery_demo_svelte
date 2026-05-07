<script lang="ts">
  import type { QueryModel, SelectOption } from '../lib/types';

  interface Props {
    model: QueryModel;
    statusOptions: SelectOption[];
    onFilter: () => void;
    onReset: () => void;
    onExport: () => void;
  }

  let { model = $bindable(), statusOptions, onFilter, onReset, onExport }: Props = $props();
</script>

<div class="card">
  <form
    class="search-form"
    onsubmit={(e) => {
      e.preventDefault();
      onFilter();
    }}
  >
    <div class="form-group">
      <label class="form-label" for="code">User Code</label>
      <input type="text" id="code" bind:value={model.code} placeholder="Enter user code" />
    </div>

    <div class="form-group">
      <label class="form-label" for="name">User Name</label>
      <input type="text" id="name" bind:value={model.name} placeholder="Enter user name" />
    </div>

    <div class="form-group">
      <label class="form-label" for="status">Status</label>
      <select id="status" bind:value={model.status}>
        <option value={null}>All</option>
        {#each statusOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <div class="search-actions">
      <button type="submit" class="primary">Search</button>
      <button type="button" class="default" onclick={onReset}>Reset</button>
      <button type="button" class="default" onclick={onExport}>Export</button>
    </div>
  </form>
</div>
