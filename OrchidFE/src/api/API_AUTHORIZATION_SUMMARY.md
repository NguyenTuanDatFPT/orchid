# API Authorization Summary - Orchid Sales Management System

## Authentication APIs (AuthController)
| Endpoint | Method | Description | Authorization |
|----------|--------|-------------|---------------|
| `/api/auth/token` | POST | Login - Get access token | PUBLIC |
| `/api/auth/refresh-token` | POST | Refresh access token | PUBLIC |
| `/api/auth/logout` | POST | Logout user | Authenticated (USER/ADMIN/STAFF) |

## User Management APIs (UserController)
| Endpoint | Method | Description | Authorization |
|----------|--------|-------------|---------------|
| `/api/user` | POST | Create user account | PUBLIC |
| `/api/user/myinfor` | GET | Get current user info | Authenticated (USER/ADMIN/STAFF) |
| `/api/user/admin/all` | GET | Get all users with pagination | ADMIN only |
| `/api/user/admin/{userId}/role` | PUT | Update user role | ADMIN only |
| `/api/user/admin/{userId}/deactivate` | PUT | Deactivate user | ADMIN only |

## Orchid Management APIs (OrchidController)
| Endpoint | Method | Description | Authorization |
|----------|--------|-------------|---------------|
| `/api/orchids` | POST | Create new orchid | ADMIN/STAFF |
| `/api/orchids/admin` | GET | Get all orchids (admin view) | ADMIN/STAFF |
| `/api/orchids` | GET | Get available orchids (public) | PUBLIC |
| `/api/orchids/{id}` | GET | Get orchid by ID | PUBLIC |
| `/api/orchids/{id}` | PUT | Update orchid | ADMIN/STAFF |
| `/api/orchids/{id}` | DELETE | Delete orchid | ADMIN only |

## Order Management APIs (OrderController)
| Endpoint | Method | Description | Authorization |
|----------|--------|-------------|---------------|
| `/api/orders` | POST | Create new order | Authenticated (USER/ADMIN/STAFF) |
| `/api/orders/admin` | GET | Get all orders (admin view) | ADMIN/STAFF |
| `/api/orders/my-orders` | GET | Get current user's orders | Authenticated (USER/ADMIN/STAFF) |
| `/api/orders/{id}` | GET | Get order by ID | Authenticated (USER/ADMIN/STAFF) |
| `/api/orders/{id}/status` | PUT | Update order status | ADMIN/STAFF |
| `/api/orders/{id}/cancel` | PUT | Cancel order | Authenticated (USER/ADMIN/STAFF) |

## Role Permissions Summary

### ADMIN (Full Access)
- All user management operations
- All orchid management operations
- All order management operations
- Can delete orchids
- Can update user roles and deactivate users

### STAFF (Limited Admin)
- View all users (read-only)
- Full orchid management (except delete)
- Order management and status updates
- Cannot manage user roles

### USER (Customer)
- View available orchids
- Create and manage their own orders
- View their order history
- Update their own profile

### PUBLIC (No Authentication)
- View available orchids and details
- Create user account
- Login and refresh tokens

## Features Implemented

### Pagination
- All list APIs support pagination with default 10 records per page
- Configurable page size (max 100 to prevent performance issues)
- Sorting support by field and direction (asc/desc)

### Filtering
- **Orchids**: by name, availability, natural type, price range
- **Orders**: by user ID, status
- **Users**: by username, role

### Security
- JWT-based authentication
- Role-based authorization using `@PreAuthorize`
- Method-level security on all sensitive operations
- Proper error handling for unauthorized access

### Data Models
- **User**: username, email, password, role, active status
- **Orchid**: name, description, price, stock, images, characteristics
- **Order**: user, items, total amount, status, shipping info
- **OrderItem**: orchid, quantity, prices

### Business Logic
- Stock management (automatic update on orders)
- Order status workflow (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED)
- Order cancellation with stock restoration
- User deactivation instead of deletion
