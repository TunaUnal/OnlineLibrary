### **RESTful API Endpoint Mimarisi**

Bu mimaride, her "kaynak" (Araç, Yolculuk, Kullanıcı vb.) kendi temel yoluna sahiptir ve o kaynak üzerinde yapılacak işlemler (okuma, yaratma, güncelleme vb.) HTTP metodları ile belirlenir.

| Kaynak | İşlem | HTTP Method | Endpoint Yolu (`Path`) | Açıklama ve Gerekli `body`/`params` |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Kullanıcı girişi yap | `POST` | `/api/auth/login` | **body:** `{ username, password }` |
| | Oturumu kontrol et | `GET` | `/api/auth/session` | Gerekli değil, header'da `token` bekler. |
| | Oturumu sonlandır | `POST`| `/api/auth/logout`| Gerekli değil. |
| **Vehicles** | Tüm araçları listele | `GET` | `/api/vehicles` | Rol bazlı filtreleme backend tarafından otomatik yapılır. |
| | Yeni araç yarat | `POST` | `/api/vehicles` | **body:** `{ plate, brand, model_year, ... }` |
| | **Tek bir aracın** detayını getir | `GET` | `/api/vehicles/:vehicleId` | **`params`:** `:vehicleId` (URL'den okunur). |
| | Bir aracı güncelle | `PUT` veya `PATCH` | `/api/vehicles/:vehicleId`| **`params`:** `:vehicleId`, **body:** `{ plate, brand, ... }` (güncellenecek alanlar) |
| | Bir aracın geçmiş yolculuklarını getir | `GET`| `/api/vehicles/:vehicleId/trips` | **`params`:** `:vehicleId`. Alt kaynak konseptine uyar. |
| **Trips**| Aktif yolculuğu getir | `GET`| `/api/trips/active` | Gerekli değil, token'daki kullanıcıya göre çalışır. |
| | Tüm geçmiş yolculukları filtrele | `GET`| `/api/trips/history` | **query string:** `/history?kurumId=1&startDate=...` ile filtreler gönderilir. |
| | Yeni bir yolculuk başlat | `POST`| `/api/trips/start` | **body:** `{ vehicleId, destination, reason, ... }` |
| | Bir yolculuğu tamamla | `POST`| `/api/trips/:tripId/complete` | **`params`:** `:tripId`. `multipart/form-data` ile `last_km` ve `photos` gönderilir. |
| **Incidents**| Yeni bir kaza/arıza bildirimi yap | `POST`| `/api/incidents`| `multipart/form-data` ile `vehicle_id`, `date`, `details`, `photos` vb. gönderilir. |
| **Data Lists**| Kurum listesini getir | `GET` | `/api/data/kurumlar` | Rol bazlı filtreleme backend tarafından yapılır. |
| | Mıntıka listesini getir | `GET` | `/api/data/mintikalar` | Rol bazlı filtreleme backend tarafından yapılır. |
| | Filtreleme için kullanıcı listesini getir | `GET` | `/api/data/users` | Rol bazlı filtreleme backend tarafından yapılır. |

---

### Eski `type` Değerleri ile Yeni Yapının Karşılaştırması

| Mevcut `type` Parametresi | Yeni RESTful Karşılığı |
| :--- | :--- |
| `login` | `POST /api/auth/login` |
| `logout` | `POST /api/auth/logout` |
| `checkSession` | `GET /api/auth/session` |
| `getAllVehicles` | `GET /api/vehicles` |
| `createVehicle` | `POST /api/vehicles` |
| `updateVehicle` | `PUT /api/vehicles/:vehicleId` |
| `getVechile` | `GET /api/vehicles/:vehicleId` |
| `getVehicleTrips`| `GET /api/vehicles/:vehicleId/trips` |
| `startTrip` | `POST /api/trips/start` |
| `activeTrip` | `GET /api/trips/active` |
| `completeTrip` | `POST /api/trips/:tripId/complete` |
| `getTripHistory` | `GET /api/trips/history` (Filtreler query string ile: `?kurumId=...`) |
| `reportIncident` | `POST /api/incidents` |
| `fetchKurum` | `GET /api/data/kurumlar` |
| `fetchMintika` | `GET /api/data/mintikalar` |
| `getUserList` | `GET /api/data/users` |

Bu RESTful yapıya geçiş yapmak, backend kodunuzu daha organize, anlaşılır ve standartlara uygun hale getirecektir. Her bir endpoint, tek bir göreve odaklanacak ve bu görev, URL yolu ve HTTP metodu ile net bir şekilde tanımlanmış olacaktır. Bu, frontend tarafında da API katmanının (`api.js`) çok daha temiz yazılmasını sağlar.