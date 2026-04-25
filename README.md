# 🏺 El Kafrwy — Ceramics Gallery

> A full-stack e-commerce web application for browsing and purchasing ceramics, tiles, and bathroom products.
> Built with **ASP.NET Core Web API** backend and **Angular** frontend.

---

## ✨ Features

### 🛒 Customer Side
- Browse products with images, prices, categories & brands
- Add to cart with quantity control
- Real-time cart total calculation
- User registration & login (JWT-secured)
- Place orders

### ⚙️ Admin Side
- Full product management (Add / Edit / Delete + image upload)
- Category management with sub-category support (e.g. Porcelain, Wall tiles)
- Brand management (Saudi, Italian, Egyptian, German)
- View & manage orders

---

## 📸 Screenshots

### 🛍️ Products Page
![Products](./screenshots/products.png)

### 🛒 Shopping Cart
![Cart](./screenshots/cart.png)

### 🏷️ Categories Management
![Categories](./screenshots/categories.png)

### 🔖 Brands Management
![Brands](./screenshots/brands.png)

### ➕ Add Product Form
![Add Product](./screenshots/add-product.png)

### 🔐 Login & Register
![Login](./screenshots/login.png)
![Register](./screenshots/register.png)

### 📋 Swagger API Docs
![Swagger](./screenshots/swagger1.png)
![Swagger Orders & Products](./screenshots/swagger2.png)

---

## 🛠️ Tech Stack

### Backend — `ElKafrwy.API`
| Technology | Purpose |
|------------|---------|
| ASP.NET Core Web API | RESTful API & routing |
| Entity Framework Core | ORM & data access |
| SQL Server | Database |
| JWT Authentication | Secure login & authorization |
| Swagger / Swashbuckle | API documentation |

### Frontend — `ElkafrawyFE`
| Technology | Purpose |
|------------|---------|
| Angular (v14+) | SPA Framework |
| TypeScript | Type-safe development |
| HTML5 / CSS3 | UI structure & styling |
| HttpClient | REST API integration |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/Auth/register` | Register new user |
| POST | `/api/Auth/login` | Login & get JWT token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Products` | Get all products |
| POST | `/api/Products` | Create product (Admin) |
| GET | `/api/Products/{id}` | Get product by ID |
| PUT | `/api/Products/{id}` | Update product (Admin) |
| DELETE | `/api/Products/{id}` | Delete product (Admin) |
| POST | `/api/Products/{id}/images` | Upload product images |

### Categories & Brands
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/Categories` | List / Create categories |
| GET/PUT/DELETE | `/api/Categories/{id}` | Manage single category |
| GET/POST | `/api/Brands` | List / Create brands |
| GET/PUT/DELETE | `/api/Brands/{id}` | Manage single brand |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Orders` | Get all orders |
| POST | `/api/Orders` | Place new order |

---

## ⚙️ Getting Started

### Prerequisites
- .NET 6+ SDK
- Node.js & npm
- SQL Server
- Angular CLI (`npm install -g @angular/cli`)

### Backend
```bash
cd ElKafrwy.API
# Update connection string in appsettings.json
dotnet ef database update
dotnet run
# API: https://localhost:7000
# Swagger: https://localhost:7000/swagger
```

### Frontend
```bash
cd FirstApp/ElkafrawyFE
npm install
ng serve
# App: http://localhost:4200
```

---

## 👤 Author

**Amgad Saad** — Full Stack .NET Developer | Riyadh, Saudi Arabia 🇸🇦

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/amgad-saad-a1a2a531a/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/saadamgad344-art)
