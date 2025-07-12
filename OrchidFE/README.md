# Orchid Sales Management System - API Documentation

## Base URL
```
http://localhost:8080
```

## CORS Configuration
Backend được cấu hình CORS để chấp nhận requests từ:
- `http://localhost:5173` (Vite development server)
- `http://localhost:3000` (React development server)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

## Seed Data
Hệ thống tự động tạo seed data khi khởi động:

### Demo Users
| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | admin | ADMIN | admin@orchid.com |
| staff | staff123 | STAFF | staff@orchid.com |
| user | user123 | USER | user@example.com |

### Sample Orchids
- **20 loại hoa lan** đa dạng với các đặc điểm khác nhau
- **Giá từ $129.99 - $699.99**
- **Tất cả đều có cùng image URL** từ Unsplash
- **Bao gồm các loại:** Phalaenopsis, Cattleya, Dendrobium, Vanda, Oncidium, v.v.

## Authentication
Sử dụng JWT Bearer token trong header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 AUTHENTICATION APIs

### 1. Login (Get Access Token)
- **URL:** `POST /api/auth/token`
- **Permission:** PUBLIC
- **Request Body:**
```json
{
    "username": "admin123",
    "password": "password123"
}
```
- **Response:**
```json
{
    "payload": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expiresIn": 3600
    },
    "message": null
}
```

### 2. Refresh Token
- **URL:** `POST /api/auth/refresh-token`
- **Permission:** PUBLIC
- **Request Body:**
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response:**
```json
{
    "payload": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expiresIn": 3600
    },
    "message": null
}
```

### 3. Logout
- **URL:** `POST /api/auth/logout`
- **Permission:** USER/ADMIN/STAFF
- **Request:** No body required
- **Response:**
```json
{
    "payload": null,
    "message": "Logout successful"
}
```

---

## 👥 USER MANAGEMENT APIs

### 1. Create User Account
- **URL:** `POST /api/user`
- **Permission:** PUBLIC
- **Request Body:**
```json
{
    "username": "newuser123",
    "password": "password123"
}
```
- **Response:**
```json
{
    "payload": null,
    "message": "Create successfully"
}
```

### 2. Get My Information
- **URL:** `GET /api/user/myinfor`
- **Permission:** USER/ADMIN/STAFF
- **Request Parameters:** None
- **Response:**
```json
{
    "payload": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "admin123",
        "email": "admin@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "ADMIN",
        "isActive": true,
        "createAt": "2025-01-01T10:30:00",
        "updateAt": "2025-01-01T10:30:00"
    },
    "message": null
}
```

### 3. Get All Users (Admin Only)
- **URL:** `GET /api/user/admin/all`
- **Permission:** ADMIN
- **Request Parameters:**
```
?page=0&size=10&sortBy=createAt&sortDirection=desc&username=john&role=USER
```
- **Response:**
```json
{
    "payload": {
        "content": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "username": "user123",
                "email": "user@example.com",
                "firstName": "Jane",
                "lastName": "Smith",
                "role": "USER",
                "isActive": true,
                "createAt": "2025-01-01T10:30:00",
                "updateAt": "2025-01-01T10:30:00"
            }
        ],
        "pageNumber": 0,
        "pageSize": 10,
        "totalElements": 1,
        "totalPages": 1,
        "first": true,
        "last": true,
        "empty": false
    },
    "message": null
}
```

### 4. Update User Role
- **URL:** `PUT /api/user/admin/{userId}/role`
- **Permission:** ADMIN
- **Request Parameters:**
```
?role=STAFF
```
- **Response:**
```json
{
    "payload": null,
    "message": "User role updated successfully"
}
```

### 5. Deactivate User
- **URL:** `PUT /api/user/admin/{userId}/deactivate`
- **Permission:** ADMIN
- **Request Parameters:** None
- **Response:**
```json
{
    "payload": null,
    "message": "User deactivated successfully"
}
```

---

## 🌺 ORCHID MANAGEMENT APIs

### 1. Create New Orchid
- **URL:** `POST /api/orchids`
- **Permission:** ADMIN/STAFF
- **Request Body:**
```json
{
    "name": "Cattleya Orchid",
    "description": "Beautiful purple cattleya orchid with vibrant colors",
    "price": 299.99,
    "stock": 50,
    "imageUrl": "https://example.com/cattleya.jpg",
    "origin": "Thailand",
    "color": "Purple",
    "size": "Medium",
    "isNatural": true,
    "isAvailable": true
}
```
- **Response:**
```json
{
    "payload": null,
    "message": "Orchid created successfully with ID: 550e8400-e29b-41d4-a716-446655440001"
}
```

### 2. Get All Orchids (Admin View)
- **URL:** `GET /api/orchids/admin`
- **Permission:** ADMIN/STAFF
- **Request Parameters:**
```
?page=0&size=10&sortBy=createAt&sortDirection=desc&name=cattleya&isAvailable=true&isNatural=true&minPrice=100&maxPrice=500
```
- **Response:**
```json
{
    "payload": {
        "content": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440001",
                "name": "Cattleya Orchid",
                "description": "Beautiful purple cattleya orchid with vibrant colors",
                "price": 299.99,
                "stock": 50,
                "imageUrl": "https://example.com/cattleya.jpg",
                "origin": "Thailand",
                "color": "Purple",
                "size": "Medium",
                "isNatural": true,
                "isAvailable": true,
                "createAt": "2025-01-01T10:30:00",
                "updateAt": "2025-01-01T10:30:00",
                "createdByUsername": "admin123"
            }
        ],
        "pageNumber": 0,
        "pageSize": 10,
        "totalElements": 1,
        "totalPages": 1,
        "first": true,
        "last": true,
        "empty": false
    },
    "message": null
}
```

### 3. Get Available Orchids (Public)
- **URL:** `GET /api/orchids`
- **Permission:** PUBLIC
- **Request Parameters:**
```
?page=0&size=10&sortBy=createAt&sortDirection=desc&name=orchid&isNatural=true&minPrice=50&maxPrice=1000
```
- **Response:** Same as admin view but only shows available orchids

### 4. Get Orchid by ID
- **URL:** `GET /api/orchids/{id}`
- **Permission:** PUBLIC
- **Request Parameters:** None
- **Response:**
```json
{
    "payload": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Cattleya Orchid",
        "description": "Beautiful purple cattleya orchid with vibrant colors",
        "price": 299.99,
        "stock": 50,
        "imageUrl": "https://example.com/cattleya.jpg",
        "origin": "Thailand",
        "color": "Purple",
        "size": "Medium",
        "isNatural": true,
        "isAvailable": true,
        "createAt": "2025-01-01T10:30:00",
        "updateAt": "2025-01-01T10:30:00",
        "createdByUsername": "admin123"
    },
    "message": null
}
```

### 5. Update Orchid
- **URL:** `PUT /api/orchids/{id}`
- **Permission:** ADMIN/STAFF
- **Request Body:**
```json
{
    "name": "Updated Cattleya Orchid",
    "description": "Updated description",
    "price": 349.99,
    "stock": 45,
    "imageUrl": "https://example.com/updated-cattleya.jpg",
    "origin": "Vietnam",
    "color": "Deep Purple",
    "size": "Large",
    "isNatural": true,
    "isAvailable": true
}
```
- **Response:**
```json
{
    "payload": null,
    "message": "Orchid updated successfully"
}
```

### 6. Delete Orchid
- **URL:** `DELETE /api/orchids/{id}`
- **Permission:** ADMIN
- **Request Parameters:** None
- **Response:**
```json
{
    "payload": null,
    "message": "Orchid deleted successfully"
}
```

---

## 🛒 ORDER MANAGEMENT APIs

### 1. Create New Order
- **URL:** `POST /api/orders`
- **Permission:** USER/ADMIN/STAFF
- **Request Body:**
```json
{
    "items": [
        {
            "orchidId": "550e8400-e29b-41d4-a716-446655440001",
            "quantity": 2
        },
        {
            "orchidId": "550e8400-e29b-41d4-a716-446655440002",
            "quantity": 1
        }
    ],
    "shippingAddress": "123 Main St, City, Country",
    "phoneNumber": "0123456789",
    "notes": "Please handle with care"
}
```
- **Response:**
```json
{
    "payload": null,
    "message": "Order created successfully with ID: 550e8400-e29b-41d4-a716-446655440010"
}
```

### 2. Get All Orders (Admin View)
- **URL:** `GET /api/orders/admin`
- **Permission:** ADMIN/STAFF
- **Request Parameters:**
```
?page=0&size=10&sortBy=createAt&sortDirection=desc&userId=550e8400-e29b-41d4-a716-446655440000&status=PENDING
```
- **Response:**
```json
{
    "payload": {
        "content": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440010",
                "userId": "550e8400-e29b-41d4-a716-446655440000",
                "username": "user123",
                "totalAmount": 899.97,
                "status": "PENDING",
                "shippingAddress": "123 Main St, City, Country",
                "phoneNumber": "0123456789",
                "notes": "Please handle with care",
                "createAt": "2025-01-01T10:30:00",
                "updateAt": "2025-01-01T10:30:00",
                "orderItems": [
                    {
                        "id": "550e8400-e29b-41d4-a716-446655440020",
                        "orchidId": "550e8400-e29b-41d4-a716-446655440001",
                        "orchidName": "Cattleya Orchid",
                        "orchidImageUrl": "https://example.com/cattleya.jpg",
                        "quantity": 2,
                        "unitPrice": 299.99,
                        "totalPrice": 599.98
                    }
                ]
            }
        ],
        "pageNumber": 0,
        "pageSize": 10,
        "totalElements": 1,
        "totalPages": 1,
        "first": true,
        "last": true,
        "empty": false
    },
    "message": null
}
```

### 3. Get My Orders
- **URL:** `GET /api/orders/my-orders`
- **Permission:** USER/ADMIN/STAFF
- **Request Parameters:**
```
?page=0&size=10&sortBy=createAt&sortDirection=desc
```
- **Response:** Same format as admin view but only current user's orders

### 4. Get Order by ID
- **URL:** `GET /api/orders/{id}`
- **Permission:** USER/ADMIN/STAFF (owner or admin/staff)
- **Request Parameters:** None
- **Response:**
```json
{
    "payload": {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "username": "user123",
        "totalAmount": 899.97,
        "status": "PENDING",
        "shippingAddress": "123 Main St, City, Country",
        "phoneNumber": "0123456789",
        "notes": "Please handle with care",
        "createAt": "2025-01-01T10:30:00",
        "updateAt": "2025-01-01T10:30:00",
        "orderItems": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440020",
                "orchidId": "550e8400-e29b-41d4-a716-446655440001",
                "orchidName": "Cattleya Orchid",
                "orchidImageUrl": "https://example.com/cattleya.jpg",
                "quantity": 2,
                "unitPrice": 299.99,
                "totalPrice": 599.98
            }
        ]
    },
    "message": null
}
```

### 5. Update Order Status
- **URL:** `PUT /api/orders/{id}/status`
- **Permission:** ADMIN/STAFF
- **Request Parameters:**
```
?status=CONFIRMED
```
- **Response:**
```json
{
    "payload": null,
    "message": "Order status updated successfully"
}
```

### 6. Cancel Order
- **URL:** `PUT /api/orders/{id}/cancel`
- **Permission:** USER/ADMIN/STAFF (owner or admin/staff)
- **Request Parameters:** None
- **Response:**
```json
{
    "payload": null,
    "message": "Order cancelled successfully"
}
```

---

## 📋 ENUMS & Constants

### User Roles
```json
["ADMIN", "STAFF", "USER"]
```

### Order Status
```json
["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
```

### Default Pagination
- **Default Page:** 0
- **Default Size:** 10
- **Max Size:** 100
- **Default Sort:** createAt
- **Default Direction:** desc

---

## 🔒 Permission Matrix

| Resource | Create | Read All | Read Own | Update | Delete | Special Actions |
|----------|--------|----------|----------|--------|--------|----------------|
| **Users** | PUBLIC | ADMIN | ALL | ADMIN | ADMIN | Role Update (ADMIN) |
| **Orchids** | ADMIN/STAFF | ADMIN/STAFF | PUBLIC | ADMIN/STAFF | ADMIN | - |
| **Orders** | ALL | ADMIN/STAFF | ALL | ADMIN/STAFF | - | Cancel (Owner/Admin/Staff) |

---

## 🚀 Quick Start Examples

### Demo Accounts (Auto-created on startup)
```
Admin: admin/admin
Staff: staff/staff123
User: user/user123
```

### Sample Data
Application tự động tạo 20 loại hoa lan mẫu khi khởi động lần đầu, bao gồm:
- Phalaenopsis White ($199.99)
- Cattleya Purple Queen ($299.99)  
- Dendrobium Golden ($249.99)
- Vanda Blue Magic ($599.99)
- Oncidium Dancing Lady ($179.99)
- Cymbidium Green Cascade ($349.99)
- Paphiopedilum Lady Slipper ($449.99)
- Miltonia Pansy Face ($219.99)
- Brassia Spider Orchid ($279.99)
- Zygopetalum Fragrant Beauty ($329.99)
- Epidendrum Star Valley ($159.99)
- Masdevallia Miniature Gem ($189.99)
- Brassavola Lady of the Night ($239.99)
- Ludisia Black Jewel ($129.99)
- Aerangis Moonlight ($389.99)
- Bulbophyllum Medusae ($469.99)
- Maxillaria Coconut Pie ($199.99)
- Dracula Vampire Orchid ($549.99)
- Vanilla Planifolia ($399.99)
- Angraecum Star of Bethlehem ($699.99)

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:8080/api/user \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### 2. Browse Orchids
```bash
# Get available orchids
curl -X GET "http://localhost:8080/api/orchids?page=0&size=5&name=orchid"
```

### 3. Place Order
```bash
# Create order (requires authentication)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [{"orchidId":"ORCHID_ID","quantity":1}],
    "shippingAddress":"123 Main St",
    "phoneNumber":"0123456789"
  }'
```
