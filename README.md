# AutoAPI Example - Svelte

A comprehensive user management system built with Svelte 5, TypeScript, and AutoAPI. This project demonstrates how to integrate AutoAPI-generated type-safe API clients with a modern Svelte application.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [AutoAPI Integration](#autoapi-integration)
- [Development Guide](#development-guide)
- [Build and Deployment](#build-and-deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Functionality
- **User Management**: Complete CRUD operations for user data
- **Advanced Search**: Filter users by code, name, and status
- **Pagination**: Efficient data browsing with customizable page sizes
- **Data Export**: Export filtered user data to Excel format
- **Image Upload**: Avatar upload with size validation and preview
- **Form Validation**: Real-time validation with async code uniqueness check
- **Status Management**: Enable/disable user accounts
- **Responsive Design**: Mobile-friendly interface

### Technical Features
- **Type-Safe API**: AutoAPI-generated TypeScript clients
- **Reactive State**: Svelte 5 reactive statements and stores
- **Component Architecture**: Modular, reusable components
- **SCSS Styling**: Organized, maintainable styles
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during async operations

## 🛠 Tech Stack

- **Framework**: Svelte 5.0
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 6.0
- **Styling**: SCSS (sass-embedded)
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **API Generation**: AutoAPI
- **Code Quality**: ESLint, Prettier

## 📦 Prerequisites

- **Node.js**: v22.0.0 (specified in `.nvmrc`)
- **npm**: v10.5.1 or higher
- **Backend Service**: Running on `http://localhost:3000`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create or verify `.env` file:

```env
VITE_GLOB_BASE_API=http://localhost:3000
```

### 3. Generate API Client (if needed)

```bash
npm run api
```

This command:
- Fetches OpenAPI spec from backend
- Generates TypeScript API clients
- Creates type definitions
- Outputs to `src/apis/auto/`

### 4. Start Development Server

```bash
npm run dev
```

Application will be available at: `http://localhost:9530`

### 5. Verify Setup

Run the verification script:

```bash
bash verify-setup.sh
```

## 📁 Project Structure

```
autoapi-example-svelte/
├── src/
│   ├── apis/
│   │   └── auto/              # AutoAPI-generated clients
│   │       └── demo/
│   │           ├── ApiUser.ts # User API client
│   │           └── types.ts   # API type definitions
│   ├── components/
│   │   ├── UserTable.svelte   # User list table
│   │   ├── UserForm.svelte    # User form fields
│   │   └── SearchForm.svelte  # Search/filter form
│   ├── views/
│   │   └── user/
│   │       ├── UserPage.svelte        # Main user page
│   │       └── components/
│   │           ├── QueryForm.svelte   # Search form
│   │           └── UserModal.svelte   # Modal wrapper
│   ├── types/
│   │   └── common.ts          # Common type definitions
│   ├── utils/
│   │   ├── dayjs.ts           # Date utility
│   │   └── message.ts         # Toast notifications
│   ├── App.svelte             # Root component
│   ├── main.ts                # Application entry
│   ├── app.scss               # Global styles
│   └── vite-env.d.ts          # Vite type definitions
├── public/
│   └── favicon.svg            # Application icon
├── .autoapirc.json            # AutoAPI configuration
├── .env                       # Environment variables
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── svelte.config.js           # Svelte configuration
```

## 🔌 AutoAPI Integration

### Configuration

`.autoapirc.json`:
```json
{
  "url": "http://localhost:3000/api-json",
  "output": "./src/apis/auto",
  "type": "axios"
}
```

### Generated API Client

AutoAPI generates type-safe API clients:

```typescript
// src/apis/auto/demo/ApiUser.ts
export async function getUserPaged(
  params: UserPagedRequestDto
): Promise<UserPagedResponseDto> {
  // Implementation
}

export async function addUser(
  params: UserAddRequestDto
): Promise<void> {
  // Implementation
}

export async function modifyUser(
  params: UserModifyRequestDto
): Promise<void> {
  // Implementation
}

export async function removeUser(
  params: { id: number }
): Promise<void> {
  // Implementation
}

export async function validateCode(
  params: { code: string }
): Promise<boolean> {
  // Implementation
}

export async function exportUsers(
  params: UserExportRequestDto
): Promise<{ data: Blob; name: string }> {
  // Implementation
}
```

### Usage Example

```typescript
import * as apiUser from '@/apis/auto/demo/ApiUser';

// Fetch paginated users
const response = await apiUser.getUserPaged({
  pagination: { page: 1, limit: 10 },
  code: 'USER001',
  name: 'John'
});

// Add new user
await apiUser.addUser({
  code: 'USER002',
  name: 'Jane Doe',
  email: 'jane@example.com',
  gender: 2,
  status: true
});
```

## 💻 Development Guide

### Component Architecture

#### UserPage.svelte (Main Container)
- Manages application state
- Coordinates child components
- Handles API calls
- Implements business logic

```typescript
// State management
let loading = false;
let dataSource: UserModel[] = [];
let pagination: PaginationConfig = {
  current: 1,
  pageSize: 10,
  total: 0
};

// API integration
async function getList() {
  loading = true;
  const res = await apiUser.getUserPaged({
    pagination: {
      page: pagination.current,
      limit: pagination.pageSize
    },
    ...queryModel
  });
  dataSource = res.results || [];
  pagination.total = res.total || 0;
  loading = false;
}
```

#### QueryForm.svelte (Search Component)
- Search input fields
- Filter controls
- Event dispatching

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let model: QueryModel;
  const dispatch = createEventDispatcher();
  
  function handleFilter() {
    dispatch('filter');
  }
</script>
```

#### UserTable.svelte (Data Display)
- Table rendering
- Pagination controls
- Action buttons
- Export functionality

#### UserForm.svelte (Form Component)
- Form fields with validation
- Image upload
- Async code validation
- Error handling

#### UserModal.svelte (Modal Wrapper)
- Modal backdrop
- Close handling
- Form integration

### Event Flow

```
User Action → Component Event → Parent Handler → API Call → State Update → UI Refresh
```

Example:
```
Click "Create" → dispatch('add') → handleAdd() → modalVisible = true → Show Modal
```

### Styling Approach

Global styles in `app.scss`:
```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...;
  background: #f0f2f5;
}
```

Component-scoped styles:
```svelte
<style lang="scss">
  .user-table {
    .table-header {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
```

### State Management

Svelte's reactive statements:
```typescript
// Reactive declarations
$: totalPages = Math.ceil(pagination.total / pagination.pageSize);
$: isViewMode = operateType === 'view';

// Reactive statements
$: if (model.avatar) {
  previewUrl = model.avatar;
}
```

### Form Validation

Real-time validation:
```typescript
async function validateCode(code: string): Promise<boolean> {
  if (!code || operateType !== 'add') {
    return true;
  }
  
  try {
    const codeExists = await apiUser.validateCode({ code });
    if (codeExists) {
      errors.code = 'Code already exists';
      return false;
    }
    delete errors.code;
    return true;
  } catch (error) {
    errors.code = 'Code validation failed';
    return false;
  }
}
```

### Image Upload

```typescript
async function handleFileChange(event: Event) {
  const file = target.files?.[0];
  if (!file) return;
  
  // Validate size
  const size = Number((file.size / 1024 / 1024).toFixed(2));
  if (size > 10) {
    message.warning('File size exceeds limit (10MB)');
    return;
  }
  
  // Upload
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(
    `${import.meta.env.VITE_GLOB_BASE_API}/file/upload`,
    { method: 'POST', body: formData }
  );
  
  const result = await response.json();
  if (result.status === 0) {
    model.avatar = `${import.meta.env.VITE_GLOB_BASE_API}/file/${result.data}`;
  }
}
```

### Export Functionality

```typescript
async function handleExport() {
  try {
    message.loading({ content: 'Exporting users...', key: 'export', duration: 0 });
    
    const response = await apiUser.exportUsers({
      code: queryModel.code || '',
      name: queryModel.name || '',
      email: ''
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
    message.error('Export failed');
  }
}
```

## 🏗 Build and Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Output directory: `dist/`

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run check
```

### Linting

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Deployment Script

Example `deploy_prod.sh`:

```bash
#!/bin/bash

# Build the project
npm run build

# Deploy to server
scp -r dist/* user@server:/var/www/html/

echo "Deployment completed!"
```

Make it executable:
```bash
chmod +x deploy_prod.sh
```

Run deployment:
```bash
./deploy_prod.sh
```

## 📚 API Documentation

### User Management Endpoints

#### Get Paginated Users
```typescript
getUserPaged(params: {
  pagination: { page: number; limit: number };
  code?: string;
  name?: string;
  status?: boolean;
}): Promise<{
  results: UserInfoDto[];
  total: number;
}>
```

#### Add User
```typescript
addUser(params: {
  code: string;
  name: string;
  email: string;
  gender?: number;
  avatar?: string;
  address?: string;
  status?: boolean;
}): Promise<void>
```

#### Modify User
```typescript
modifyUser(params: {
  id: number;
  code: string;
  name: string;
  email: string;
  gender?: number;
  avatar?: string;
  address?: string;
  status?: boolean;
}): Promise<void>
```

#### Remove User
```typescript
removeUser(params: {
  id: number;
}): Promise<void>
```

#### Validate Code
```typescript
validateCode(params: {
  code: string;
}): Promise<boolean>
```

#### Export Users
```typescript
exportUsers(params: {
  code?: string;
  name?: string;
  email?: string;
}): Promise<{
  data: Blob;
  name: string;
}>
```

### Type Definitions

```typescript
interface UserModel {
  id?: number;
  code: string;
  name: string;
  email: string;
  gender?: number;
  avatar?: string;
  address?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface QueryModel {
  code?: string;
  name?: string;
  status?: boolean;
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

type OperateType = 'add' | 'edit' | 'view';

interface SelectOption {
  value: any;
  label: string;
  color?: string;
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Backend Connection Error

**Problem**: Cannot connect to backend API

**Solution**:
```bash
# Check backend is running
curl http://localhost:3000/health

# Verify .env configuration
cat .env

# Restart backend service
cd ../ruoqing-product-demo-nestjs
npm run start:dev
```

#### 2. API Generation Fails

**Problem**: `npm run api` fails

**Solution**:
```bash
# Verify backend is running
curl http://localhost:3000/api-json

# Check .autoapirc.json configuration
cat .autoapirc.json

# Manually regenerate
npx autoapi generate
```

#### 3. TypeScript Errors

**Problem**: Type errors in IDE

**Solution**:
```bash
# Run type checking
npm run check

# Regenerate API types
npm run api

# Restart TypeScript server in IDE
```

#### 4. SCSS Compilation Error

**Problem**: SCSS preprocessing fails

**Solution**:
```bash
# Install sass-embedded
npm install -D sass-embedded

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 5. Image Upload Fails

**Problem**: Avatar upload not working

**Solution**:
- Check file size (must be < 10MB)
- Verify backend upload endpoint is accessible
- Check CORS configuration
- Verify `VITE_GLOB_BASE_API` in `.env`

#### 6. Export Not Working

**Problem**: Export button doesn't download file

**Solution**:
- Check browser console for errors
- Verify backend export endpoint
- Check browser download settings
- Ensure popup blocker is disabled

### Development Tips

1. **Hot Module Replacement**: Vite provides instant HMR for fast development

2. **Component DevTools**: Use Svelte DevTools browser extension

3. **API Debugging**: Check Network tab in browser DevTools

4. **State Inspection**: Add console.log in reactive statements

5. **Type Safety**: Let TypeScript catch errors early

### Performance Optimization

1. **Code Splitting**: Vite automatically splits code

2. **Lazy Loading**: Use dynamic imports for large components

3. **Image Optimization**: Compress images before upload

4. **Pagination**: Always use pagination for large datasets

5. **Debouncing**: Debounce search inputs to reduce API calls

## 📝 Additional Documentation

- [FEATURES.md](./FEATURES.md) - Detailed feature documentation
- [MIGRATION_FROM_VUE.md](./MIGRATION_FROM_VUE.md) - Migration guide from Vue3
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write meaningful component names
4. Add comments for complex logic
5. Test all features before committing

## 📄 License

This project is part of the AutoAPI examples collection.

## 🔗 Related Projects

- [autoapi-example-vue3](../autoapi-example-vue3) - Vue 3 implementation
- [autoapi-example-react](../autoapi-example-react) - React implementation
- [ruoqing-product-demo-nestjs](../ruoqing-product-demo-nestjs) - Backend service

## 📞 Support

For issues and questions:
1. Check this README
2. Review the troubleshooting section
3. Check the backend service documentation
4. Review AutoAPI documentation

---

**Built with ❤️ using Svelte 5 and AutoAPI**
