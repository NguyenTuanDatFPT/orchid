# Orchid Sales Management System - API Documentation

## Authentication APIs

### 1. Login - Get Access Token
- **Endpoint:** `/api/auth/token`
- **Method:** POST
- **Request Body:**
```json
{
  "username": "string (5-20 chars)",
  "password": "string (5-30 chars)"
}
```
- **Response:**
```json
{
  "isAuthenticate": true,
  "jwtToken": "string",
  "role": "USER|ADMIN|STAFF"
}
```
- **Description:** Đăng nhập, trả về JWT token và role.

---

### 2. Refresh Access Token
- **Endpoint:** `/api/auth/refresh-token`
- **Method:** POST
- **Request Body:**
```json
{
  "token": "string (refresh token)"
}
```
- **Response:**
```json
{
  "isAuthenticate": true,
  "jwtToken": "string",
  "role": "USER|ADMIN|STAFF"
}
```

---

### 3. Logout
- **Endpoint:** `/api/auth/logout`
- **Method:** POST
- **Authorization:** Bearer Token (USER/ADMIN/STAFF)
- **Response:**
```json
{
  "code": 200,
  "message": "Logout successful"
}
```

---

## User Management APIs

### 1. Create User Account
- **Endpoint:** `/api/user`
- **Method:** POST
- **Request Body:**
```json
{
  "username": "string (5-20 chars)",
  "password": "string (5-30 chars)"
}
```
- **Response:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "USER",
  "isActive": true,
  "createAt": "yyyy-MM-dd'T'HH:mm:ss",
  "updateAt": "yyyy-MM-dd'T'HH:mm:ss"
}
```

### 2. Get Current User Info
- **Endpoint:** `/api/user/myinfor`
- **Method:** GET
- **Authorization:** Bearer Token
- **Response:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "USER|ADMIN|STAFF",
  "isActive": true,
  "createAt": "yyyy-MM-dd'T'HH:mm:ss",
  "updateAt": "yyyy-MM-dd'T'HH:mm:ss"
}
```

---

## Orchid Management APIs

### 1. Create New Orchid
- **Endpoint:** `/api/orchids`
- **Method:** POST
- **Authorization:** Bearer Token (ADMIN/STAFF)
- **Request Body:**
```json
{
  "name": "string (max 100)",
  "description": "string (max 1000)",
  "price": 0,
  "stock": 0,
  "imageUrl": "string",
  "origin": "string (max 50)",
  "color": "string (max 50)",
  "size": "string (max 50)",
  "isNatural": true,
  "isAvailable": true
}
```
- **Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 0,
  "stock": 0,
  "imageUrl": "string",
  "origin": "string",
  "color": "string",
  "size": "string",
  "isNatural": true,
  "isAvailable": true,
  "createAt": "yyyy-MM-dd'T'HH:mm:ss",
  "updateAt": "yyyy-MM-dd'T'HH:mm:ss",
  "createdByUsername": "string"
}
```

### 2. Get Available Orchids (Public)
- **Endpoint:** `/api/orchids`
- **Method:** GET
- **Query Params:**
  - `page` (int, optional)
  - `size` (int, optional)
  - `sort` (string, optional)
  - `name`, `availability`, `naturalType`, `priceMin`, `priceMax` (optional)
- **Response:**
```json
{
  "content": [
    { /* OrchidResponse */ }
  ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 100,
  "totalPages": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

### 3. Get Orchid By ID (Public)
- **Endpoint:** `/api/orchids/{id}`
- **Method:** GET
- **Path Param:** `id` (string)
- **Response:**
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 0,
  "stock": 0,
  "imageUrl": "string",
  "origin": "string",
  "color": "string",
  "size": "string",
  "isNatural": true,
  "isAvailable": true,
  "createAt": "yyyy-MM-dd'T'HH:mm:ss",
  "updateAt": "yyyy-MM-dd'T'HH:mm:ss",
  "createdByUsername": "string"
}
```

---

## Order Management APIs

### 1. Create New Order
- **Endpoint:** `/api/orders`
- **Method:** POST
- **Authorization:** Bearer Token
- **Request Body:**
```json
{
  "items": [
    {
      "orchidId": "string",
      "quantity": 1
    }
  ],
  "shippingAddress": "string (max 500)",
  "phoneNumber": "string (10-11 digits)",
  "notes": "string (max 500)"
}
```
- **Response:**
```json
{
  "id": "string",
  "userId": "string",
  "username": "string",
  "totalAmount": 0,
  "status": "PENDING|CONFIRMED|...",
  "shippingAddress": "string",
  "phoneNumber": "string",
  "notes": "string",
  "createAt": "yyyy-MM-dd'T'HH:mm:ss",
  "updateAt": "yyyy-MM-dd'T'HH:mm:ss",
  "orderItems": [
    {
      "id": "string",
      "orchidId": "string",
      "orchidName": "string",
      "orchidImageUrl": "string",
      "quantity": 1,
      "unitPrice": 0,
      "totalPrice": 0
    }
  ]
}
```

### 2. Get All Orders (ADMIN/STAFF)
- **Endpoint:** `/api/orders/admin`
- **Method:** GET
- **Authorization:** Bearer Token (ADMIN/STAFF)
- **Query Params:**
  - `page` (int, optional)
  - `size` (int, optional)
  - `sortBy` (string, optional)
  - `sortDirection` (string, optional)
  - `userId` (string, optional)
  - `status` (OrderStatus, optional)
- **Response:**
```json
{
  "content": [ { /* OrderResponse */ } ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 100,
  "totalPages": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

### 3. Get My Orders
- **Endpoint:** `/api/orders/my-orders`
- **Method:** GET
- **Authorization:** Bearer Token (USER/ADMIN/STAFF)
- **Query Params:**
  - `page`, `size`, `sortBy`, `sortDirection` (optional)
- **Response:**
```json
{
  "content": [ { /* OrderResponse */ } ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 100,
  "totalPages": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

### 4. Get Order By ID
- **Endpoint:** `/api/orders/{id}`
- **Method:** GET
- **Authorization:** Bearer Token (USER/ADMIN/STAFF)
- **Path Param:** `id` (string)
- **Response:**
```json
{ /* OrderResponse */ }
```

### 5. Update Order Status
- **Endpoint:** `/api/orders/{id}/status`
- **Method:** PUT
- **Authorization:** Bearer Token (ADMIN/STAFF)
- **Path Param:** `id` (string)
- **Request Param:** `status` (OrderStatus)
- **Response:**
```json
{
  "code": 200,
  "message": "Order status updated"
}
```

### 6. Cancel Order
- **Endpoint:** `/api/orders/{id}/cancel`
- **Method:** PUT
- **Authorization:** Bearer Token (USER/ADMIN/STAFF)
- **Path Param:** `id` (string)
- **Response:**
```json
{
  "code": 200,
  "message": "Order cancelled"
}
```

---

## Orchid Management APIs (Admin/Staff)

### 4. Get All Orchids (ADMIN/STAFF)
- **Endpoint:** `/api/orchids/admin`
- **Method:** GET
- **Authorization:** Bearer Token (ADMIN/STAFF)
- **Query Params:**
  - `page`, `size`, `sortBy`, `sortDirection`, `name`, `isAvailable`, `isNatural`, `minPrice`, `maxPrice` (optional)
- **Response:**
```json
{
  "content": [ { /* OrchidResponse */ } ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 100,
  "totalPages": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

### 5. Update Orchid
- **Endpoint:** `/api/orchids/{id}`
- **Method:** PUT
- **Authorization:** Bearer Token (ADMIN/STAFF)
- **Path Param:** `id` (string)
- **Request Body:**
```json
{
  "name": "string (max 100)",
  "description": "string (max 1000)",
  "price": 0,
  "stock": 0,
  "imageUrl": "string",
  "origin": "string (max 50)",
  "color": "string (max 50)",
  "size": "string (max 50)",
  "isNatural": true,
  "isAvailable": true
}
```
- **Response:**
```json
{
  "code": 200,
  "message": "Orchid updated"
}
```

### 6. Delete Orchid
- **Endpoint:** `/api/orchids/{id}`
- **Method:** DELETE
- **Authorization:** Bearer Token (ADMIN)
- **Path Param:** `id` (string)
- **Response:**
```json
{
  "code": 200,
  "message": "Orchid deleted"
}
```

---

## User Management APIs (Admin)

### 3. Get All Users
- **Endpoint:** `/api/user/admin/all`
- **Method:** GET
- **Authorization:** Bearer Token (ADMIN)
- **Query Params:**
  - `page`, `size`, `sortBy`, `sortDirection`, `username`, `role` (optional)
- **Response:**
```json
{
  "content": [ { /* UserResponse */ } ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 100,
  "totalPages": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

### 4. Update User Role
- **Endpoint:** `/api/user/admin/{userId}/role`
- **Method:** PUT
- **Authorization:** Bearer Token (ADMIN)
- **Path Param:** `userId` (string)
- **Request Param:** `role` (string)
- **Response:**
```json
{
  "code": 200,
  "message": "User role updated"
}
```

### 5. Deactivate User
- **Endpoint:** `/api/user/admin/{userId}/deactivate`
- **Method:** PUT
- **Authorization:** Bearer Token (ADMIN)
- **Path Param:** `userId` (string)
- **Response:**
```json
{
  "code": 200,
  "message": "User deactivated"
}
```

---

## Response Wrapper

Tất cả các response đều có thể được bọc bởi:
```json
{
  "code": 200,
  "message": "Ok",
  "payload": { ...response data... }
}
```

---

## Lưu ý
- Các API yêu cầu xác thực cần gửi header: `Authorization: Bearer <jwtToken>`
- Các trường ngày giờ theo định dạng ISO 8601.
- Các lỗi sẽ trả về mã lỗi và message phù hợp.

---

## Tham khảo thêm
- Xem chi tiết các enum: `Role`, `OrderStatus` trong mã nguồn.
- Các API khác (admin, update, delete...) có thể bổ sung tương tự theo mẫu trên.
