# Backend API Contract & Data Structure

This document outlines the JSON data structures and API endpoints required for the **Rizal University System** frontend. 
The backend team should implement these endpoints to ensure the frontend functions correctly.

**Note:**
- The frontend will send JSON payloads as described below.
- Please ensure your API returns JSON responses matching the "Response" examples.
- You can use these examples to build your controllers and models immediately without waiting for the UI.

## Recommended Testing Tools
To test your endpoints before the Frontend is connected, please use:
- **[Postman](https://www.postman.com/)**: Standard industry tool for testing APIs.
- **[Insomnia](https://insomnia.rest/)**: A lightweight alternative to Postman.
- **cURL**: For command-line testing.

---

## 1. Authentication

### **Login**
*   **Endpoint:** `POST /api/auth/login`
*   **Description:** Authenticates a user (Student, Admin, or SG) and returns a token/role.

**Request Payload:**
```json
{
  "email": "admin@rizal.edu",
  "password": "password123"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...", 
  "user": {
    "id": "ADMIN-01",
    "name": "Admin User",
    "email": "admin@rizal.edu",
    "role": "admin", 
    "college": "Any"
  }
}
```
*Note: `role` can be `"student"`, `"admin"`, or `"sg"`.*

---

## 2. Student Management

### **Student Registration (Create Account)**
*   **Endpoint:** `POST /api/students/register`
*   **Description:** Creates a new student record with "Pending" status.
*   **Used In:** `CreateAccount.vue`

**Request Payload:**
```json
{
  "fullName": "Jose Rizal",
  "studentId": "2023-0001",
  "email": "jose@rizal.edu",
  "college": "College of Engineering",
  "program": "BS Computer Engineering"
}
```

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please proceed to face scanning.",
  "student": {
    "id": "2023-0001",
    "status": "pending_face_scan"
  }
}
```

---

### **Get Pending Approvals**
*   **Endpoint:** `GET /api/students/pending`
*   **Description:** Returns a list of students who have registered but not yet completed face scanning/approval.
*   **Used In:** `AccountApprovals.vue` (SG Dashboard)

**Response (Success - 200 OK):**
```json
[
  {
    "id": "2023-0001",
    "name": "Jose Rizal",
    "program": "BS Computer Engineering",
    "college": "College of Engineering",
    "email": "jose@rizal.edu",
    "faceRegistered": false,
    "status": "pending"
  },
  {
    "id": "2023-0002",
    "name": "Maria Clara",
    "program": "BS Psychology",
    "college": "College of Arts and Sciences",
    "email": "maria@rizal.edu",
    "faceRegistered": false,
    "status": "pending"
  }
]
```

---

### **Approve Student (Face Scan Success)**
*   **Endpoint:** `POST /api/students/approve`
*   **Description:** Marks a student as fully registered after face scan.
*   **Used In:** `AccountApprovals.vue`

**Request Payload:**
```json
{
  "studentId": "2023-0001",
  "faceScanData": "base64_string_or_image_url_if_needed", 
  "approvedBy": "SG-01" 
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Student successfully verified and active.",
  "student": {
    "id": "2023-0001",
    "status": "active",
    "faceRegistered": true
  }
}
```

---

## 3. Admin / User Management

### **Get All Users**
*   **Endpoint:** `GET /api/users`
*   **Description:** Returns all users for the admin dashboard.
*   **Used In:** `UserManagement.vue`

**Query Parameters (Optional):**
- `?status=Active` (Filter by status)
- `?search=Jose` (Search by name or ID)

**Response (Success - 200 OK):**
```json
[
  { 
    "id": "2023-0001", 
    "name": "Jose Rizal", 
    "email": "jose@rizal.edu", 
    "college": "Engineering", 
    "status": "Active", 
    "role": "Student" 
  },
  { 
    "id": "ADMIN-01", 
    "name": "System Admin", 
    "email": "admin@rizal.edu", 
    "college": "N/A", 
    "status": "Active", 
    "role": "Admin" 
  }
]
```
