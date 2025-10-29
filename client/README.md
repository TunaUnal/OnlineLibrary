# Son Güncelleme 17.08.2025
## 🛠️ Toplantı Notlarım
- **Soru: Adminlerin aktif seyehatleri görüntüleyebilecekleri bir ekran? Yönetici o an hangi araba kimde görebilir.**
- **TODO: Seyehat geçmişininde her seyehatin yanında detaya git butonu olacak. Seyehat detayda ise tüm bilgiler ve fotoğraflar gözükecek.**

# Araç Takip Sistemi - Frontend Projesi

Bu proje, bir kurum içindeki araçların takibi, yolculukların yönetimi ve ilgili operasyonel süreçlerin (kaza/arıza bildirimi, araç ekleme/düzenleme vb.) yürütülmesi için geliştirilmiş modern bir web uygulamasıdır.

## 🚀 Projenin Amacı

Bu uygulama, araç yönetim süreçlerini dijitalleştirerek verimliliği artırmayı, manuel işlemleri azaltmayı ve yöneticilere anlık veri sunarak karar alma süreçlerini kolaylaştırmayı hedefler. Rol bazlı yetkilendirme ile her kullanıcının sadece kendi yetki alanındaki bilgilere erişmesi sağlanır.

## 🛠️ Kullanılan Teknolojiler

- **Frontend Kütüphanesi:** [**React**](https://reactjs.org/) (Vite ile oluşturuldu)
- **State Yönetimi:** [**Redux Toolkit**](https://redux-toolkit.js.org/)
- **Yönlendirme (Routing):** [**React Router Dom**](https://reactrouter.com/)
- **UI Kütüphanesi:** [**Bootstrap 5**](https://getbootstrap.com/)
- **API İstekleri:** [**Axios**](https://axios-http.com/)
- **Yardımcı Kütüphaneler:**
  - **Tarih Formatlama:** [**date-fns**](https://date-fns.org/)
  - **Pop-up/Bildirimler:** [**SweetAlert2**](https://sweetalert2.github.io/)

## ✨ Öne Çıkan Özellikler ve Mimari Kararlar

- **Bileşen Tabanlı Mimari:** Uygulama, `Page` ve `Component`'ler olarak iki ana katmana ayrılmıştır. `Page`'ler ana yerleşimden (Header, Sidebar) sorumlu iken, `Component`'ler asıl iş mantığını ve arayüz elemanlarını içerir. Bu yapı, kodun yeniden kullanılabilirliğini ve bakımını kolaylaştırır.

- **Merkezi State Yönetimi (Redux):** Kullanıcı, yolculuk, araç, kurum ve mıntıka gibi global veriler Redux Toolkit kullanılarak yönetilmektedir. `AsyncThunk`, API'larla asenkron iletişimi yönetmek için standart olarak kullanılır.

- **Rol Bazlı Yetkilendirme (RBAC):** Hem frontend arayüzü hem de backend API'ı, kullanıcının rolüne (`Admin`, `Director`, `Manager`, `User`) göre farklı veri ve aksiyonları gösterir/gizler. Bu, veri güvenliğini sağlar ve her kullanıcıya temiz bir arayüz sunar.

- **Merkezi API Katmanı:** Tüm backend istekleri, `src/api.js` dosyasında merkezi olarak yönetilmektedir. Bu, API endpoint'lerinin veya yapısının değişmesi durumunda sadece tek bir dosyanın güncellenmesini gerektirir ve kod tekrarını önler.

- **Kullanıcı Akışı Yönetimi:**
  - **Korunmuş Rotalar:** Kullanıcı giriş yapmadan korumalı sayfalara erişemez.
  - **Derin Link (Deep Link) Koruma:** Login olmayan bir kullanıcı, spesifik bir linke (`/trip/start?id=2` gibi) tıkladığında, giriş yaptıktan sonra otomatik olarak gitmek istediği sayfaya yönlendirilir.
  - **"Farkındalık" Arayüzü:** Aktif bir yolculuğu olan kullanıcı, herhangi bir sayfaya kilitlenmek yerine, sistem içinde özgürce gezinirken üst kısımda çıkan bir banner ile durumdan haberdar edilir.


## 🗂️ Proje Yapısı

```
/src
|-- /api
|   |-- api.js            # Merkezi API fonksiyonları
|
|-- /assets
|   |-- style.css         # Global CSS stilleri
|
|-- /components
|   |-- /GeneralComponents # Header, Sidebar, Footer gibi genel bileşenler
|   |-- /...              # Diğer yeniden kullanılabilir bileşenler (örn: PhotoUploader)
|
|-- /pages
|   |-- Login.jsx         # Giriş sayfası
|   |-- Main.jsx          # Ana Dashboard
|   |-- ActiveTripPage.jsx  # Aktif yolculuk detay sayfası
|   |-- VehiclesPage.jsx    # Araç listeleme sayfası
|   |-- CreateVehicle.jsx   # Yeni araç ekleme sayfası
|   |-- ...               # Diğer tüm sayfalar
|
|-- /store
|   |-- store.js          # Redux ana store konfigürasyonu
|   |-- features         # Her bir veri modeli için slice'lar (UserSlice, TripSlice vb.)
|
|-- App.jsx               # Ana uygulama bileşeni ve Rota yönetimi
|-- main.jsx              # Projenin giriş noktası
```