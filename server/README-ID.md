# Dokumentasi Bahasa Indonesia

Dokumen ini berisi panduan lengkap untuk memahami arsitektur, instalasi, pengembangan, serta proses deployment server untuk proyek **Next Fastify Template**.

## Daftar Isi

- [Arsitektur](#arsitektur)
    - [Gambaran Umum](#gambaran-umum)
    - [Penjelasan Tiap Layer](#penjelasan-tiap-layer)
    - [Aliran Data](#aliran-data)
- [Memulai](#memulai)
    - [Prasyarat](#prasyarat)
    - [Instalasi](#instalasi)
    - [Konfigurasi](#konfigurasi)
    - [Menjalankan Server](#menjalankan-server)
    - [Variabel Lingkungan](#variabel-lingkungan)
- [Dokumentasi API](#dokumentasi-api)
    - [Swagger UI](#swagger-ui)
    - [Autentikasi](#autentikasi)
- [Pengujian](#pengujian)
- [Deployment](#deployment)

---

## Arsitektur

### Gambaran Umum

Server ini dibangun menggunakan **Fastify** dengan **TypeScript**, serta menerapkan prinsip **arsitektur berlapis**.  
Pendekatan ini bertujuan untuk memisahkan tanggung jawab antar bagian aplikasi, memudahkan proses pengujian, serta menjaga codebase tetap rapi dan terstruktur.

Struktur utama proyek ini meliputi:

- Controllers
- Services
- Repositories
- Database (menggunakan Drizzle ORM)
- Middlewares
- Configuration
- Utilities

Setiap layer memiliki peran khusus yang jelas untuk mendukung pengembangan skala kecil hingga besar.

Tentu, berikut penjelasannya dalam bahasa Indonesia dengan gaya formal dan natural:

---

### Diagram Arsitektur

Diagram berikut menggambarkan alur perjalanan sebuah permintaan (request) dari klien melalui arsitektur server yang berlapis, mulai dari penerimaan permintaan hingga operasi database, lalu kembali memberikan respons ke klien.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                         │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                       FASTIFY SERVER                        │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                        MIDDLEWARES                          │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │ Auth Check  │  │ Logging  │  │ Validation│  │ Others  │  │
│  └─────────────┘  └──────────┘  └───────────┘  └─────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                       CONTROLLERS                           │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  User       │  │  Auth    │  │  File     │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                         SERVICES                            │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  User       │  │  Auth    │  │  File     │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                      REPOSITORIES                           │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  User       │  │  Auth    │  │  File     │  │  etc.   │  │
│  └──────┬──────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
└─────────┼───────────────┼───────────────┼────────────┼──────┘
          │               │               │            │
          ▼               ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                        DRIZZLE ORM                          │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌──────────────────────┐    ┌────────────┐    ┌───────────────┐
│  PostgreSQL Database │    │ S3 Storage │    │ External APIs │
└──────────────────────┘    └────────────┘    └───────────────┘
```

**Penjelasan Alur:**

1. **Client Request**  
   Permintaan dimulai dari sisi klien, misalnya melalui aplikasi web atau mobile, lalu dikirimkan ke server.

2. **Fastify Server**  
   Fastify menerima permintaan tersebut dan bertindak sebagai pintu gerbang untuk mengelola alur selanjutnya.

3. **Middlewares**  
   Sebelum diteruskan ke logika bisnis, permintaan melewati serangkaian middleware, seperti:

    - **Auth Check**: Memeriksa otentikasi pengguna.
    - **Logging**: Mencatat aktivitas permintaan untuk kebutuhan audit dan debug.
    - **Validation**: Memastikan data yang dikirim klien sesuai dengan format yang diharapkan.
    - **Others**: Middleware lainnya sesuai kebutuhan, seperti penanganan rate limit atau monitoring.

4. **Controllers**  
   Setelah lolos dari middleware, permintaan diteruskan ke controller yang relevan berdasarkan endpoint. Controller bertugas memvalidasi permintaan lebih lanjut dan meneruskannya ke service layer.

5. **Services**  
   Di layer service, seluruh logika bisnis dijalankan. Service akan mengoordinasikan antara controller dan repository, mengolah data, serta memutuskan tindakan yang perlu dilakukan.

6. **Repositories**  
   Service akan berinteraksi dengan repository untuk mengambil atau menyimpan data. Repository bertanggung jawab mengelola komunikasi dengan database melalui Drizzle ORM.

7. **Drizzle ORM**  
   Drizzle bertindak sebagai jembatan antara repository dan database PostgreSQL. Drizzle juga mengatur operasi database seperti kueri, update, delete, dan lainnya.

8. **Database & External Services**  
   Pada akhirnya, data yang diperlukan diambil dari PostgreSQL Database, atau bisa juga berinteraksi dengan layanan eksternal seperti:

    - **S3 Storage**: Untuk kebutuhan penyimpanan file seperti gambar, dokumen, dan lainnya.
    - **External APIs**: Untuk berkomunikasi dengan layanan pihak ketiga bila dibutuhkan.

9. **Respons ke Klien**  
   Setelah semua proses selesai, hasil akhirnya dikembalikan ke klien dalam bentuk respons HTTP.

---

Mau sekalian aku bantu buatin juga versi visual lebih rapi dalam format PNG atau merapikan penjelasan ini dalam format tabel kalau kamu mau? Mau sekalian?

### Penjelasan Tiap Layer

**Controllers**

- Bertugas menerima permintaan HTTP dari klien.
- Melakukan validasi awal terhadap input.
- Meneruskan data ke layer service untuk diproses.
- Mengatur bentuk dan isi respons HTTP yang dikirimkan kembali.
- Tidak menyimpan logika bisnis utama.

**Services**

- Berisi logika bisnis utama aplikasi.
- Mengelola aliran data dari controller menuju repository.
- Melakukan transformasi data atau validasi lanjutan bila diperlukan.
- Tidak berhubungan langsung dengan HTTP, sehingga lebih mudah diuji.

**Repositories**

- Menjadi lapisan abstraksi untuk operasi database.
- Berinteraksi langsung dengan Drizzle ORM untuk query.
- Membantu menjaga codebase tetap modular dan mudah diganti atau dimock pada saat pengujian.

**Middlewares**

- Menangani kebutuhan lintas sektor seperti autentikasi, otorisasi, validasi, logging, serta error handling.
- Biasanya berjalan sebelum controller menerima permintaan.

**Configuration**

- Menyimpan seluruh konfigurasi aplikasi, termasuk pengaturan berdasarkan lingkungan (development, production, dsb).
- Menyederhanakan pengelolaan variabel lingkungan dan pengaturan internal aplikasi.

**Utilities**

- Berisi fungsi-fungsi pembantu (helper) yang dapat digunakan di berbagai tempat dalam aplikasi.
- Membantu menghindari pengulangan kode (code duplication).

### Aliran Data

1. Klien mengirimkan permintaan HTTP ke server Fastify.
2. Permintaan diproses melalui middleware yang sesuai.
3. Controller menerima permintaan dan memvalidasi data.
4. Controller memanggil metode service terkait.
5. Service menjalankan logika bisnis dan memanfaatkan repository untuk interaksi database.
6. Repository menjalankan operasi database melalui Drizzle ORM.
7. Data hasil operasi dikembalikan ke service, lalu diteruskan ke controller.
8. Controller memformat hasil dan mengembalikannya sebagai respons HTTP ke klien.

---

## Memulai

### Prasyarat

Sebelum mulai mengembangkan proyek ini, pastikan Anda telah menginstal:

- Node.js versi 18 atau lebih baru
- npm atau yarn
- Database PostgreSQL aktif
- Opsional: Layanan penyimpanan file berbasis S3 (seperti MinIO)

### Instalasi

Langkah-langkah instalasi sebagai berikut:

```bash
# Clone repository
git clone https://github.com/yourusername/next-fastify-template.git
cd next-fastify-template/server

# Instalasi dependensi
npm install
# atau
yarn install
```

### Konfigurasi

1. Salin file `.env.example` untuk membuat konfigurasi lingkungan:

    ```bash
    cp .env.example .env
    ```

2. Sesuaikan file `.env` dengan kebutuhan Anda, contohnya:

    ```
    # Koneksi Database
    DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase

    # Konfigurasi JWT
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=1d

    # Konfigurasi Server
    PORT=3001
    HOST=0.0.0.0
    NODE_ENV=development

    # Konfigurasi S3 (opsional untuk file upload)
    S3_ENDPOINT=http://localhost:9000
    S3_ACCESS_KEY=minioadmin
    S3_SECRET_KEY=minioadmin
    S3_BUCKET=uploads

    # Swagger Dokumentasi
    ENABLE_SWAGGER=true
    ```

3. Persiapkan database:

    ```bash
    # Generate migrasi Drizzle berdasarkan skema
    npm run drizzle:generate

    # Terapkan perubahan skema langsung ke database (hanya untuk pengembangan)
    npm run drizzle:push

    # Atau, terapkan migrasi (direkomendasikan untuk produksi)
    npm run drizzle:migrate

    # Seed database dengan data awal
    npm run drizzle:seed
    ```

### Menjalankan Server

**Mode Pengembangan**

```bash
npm run dev
```

**Mode Produksi**

```bash
# Build proyek terlebih dahulu
npm run build

# Jalankan server dalam mode produksi
npm start
```

**Menjalankan dengan Docker**

```bash
# Dari direktori root proyek
docker-compose up --build
```

### Variabel Lingkungan

| Variabel         | Keterangan                            | Default     |
| ---------------- | ------------------------------------- | ----------- |
| `PORT`           | Port yang digunakan server            | 3001        |
| `HOST`           | Host server                           | 0.0.0.0     |
| `NODE_ENV`       | Environment aplikasi                  | development |
| `DATABASE_URL`   | Koneksi database PostgreSQL           | -           |
| `DATABASE_SSL`   | Mengaktifkan koneksi SSL ke database  | false       |
| `JWT_SECRET`     | Kunci rahasia JWT                     | -           |
| `JWT_EXPIRES_IN` | Durasi kedaluwarsa JWT                | 1d          |
| `ENABLE_SWAGGER` | Aktifkan dokumentasi Swagger          | true        |
| `S3_ENDPOINT`    | Alamat endpoint penyimpanan S3        | -           |
| `S3_ACCESS_KEY`  | Kunci akses untuk penyimpanan S3      | -           |
| `S3_SECRET_KEY`  | Kunci rahasia untuk penyimpanan S3    | -           |
| `S3_BUCKET`      | Nama bucket di layanan penyimpanan S3 | -           |

---

## Dokumentasi API

### Swagger UI

Untuk melihat dokumentasi API secara interaktif:

1. Pastikan server sudah berjalan dan `
