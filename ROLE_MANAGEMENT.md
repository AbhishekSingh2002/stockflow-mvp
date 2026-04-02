# Role Management Guide

## Current Role System

### Role Hierarchy
- **VIEWER**: Read-only access to dashboard and financial records
- **ANALYST**: Can view + create/edit financial records + access analytics
- **ADMIN**: Full access including user management

## How to Change Roles

### Method 1: Database (Recommended for Admins)

1. **Open Prisma Studio:**
   ```bash
   cd backend
   npx prisma studio
   ```

2. **Find your user** in the User table
3. **Change role field:**
   - `VIEWER` → `ANALYST` (can add/edit transactions)
   - `ANALYST` → `ADMIN` (full access)

### Method 2: Create New Users

1. **Sign up with new email** - First user of organization becomes Admin
2. **Create multiple user accounts** with different roles for testing

### Method 3: API Testing

Use these API calls to test role changes:

```bash
# Login as Admin and create new Analyst user
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analyst@test.com",
    "password": "password123",
    "role": "ANALYST",
    "status": "ACTIVE"
  }'

# Login as new Analyst user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analyst@test.com", 
    "password": "password123"
  }'
```

## Role-Based UI Features

### VIEWER
- ✅ Dashboard with summaries
- ✅ View financial records
- ❌ No "Add Transaction" button
- ❌ No edit/delete on records
- ❌ Cannot access User Management

### ANALYST  
- ✅ All VIEWER features
- ✅ "Add Transaction" button
- ✅ Edit/Delete financial records
- ✅ Advanced analytics (/dashboard/analytics)
- ❌ Cannot access User Management

### ADMIN
- ✅ All ANALYST features
- ✅ User Management page at /settings
- ✅ Create/update/delete users
- ✅ Full system control

## Testing Role-Based Access

1. **Login as VIEWER** - Verify limited access
2. **Login as ANALYST** - Verify transaction creation works
3. **Login as ADMIN** - Verify user management access

The role-based access control is working as designed!
