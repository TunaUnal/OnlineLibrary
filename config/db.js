import { Sequelize } from "sequelize";
import "dotenv/config.js";

// .env dosyasından bağlantı cümlesini alarak yeni bir Sequelize instance oluştur
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

// Veritabanı bağlantısını test etmek için bir fonksiyon
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL veritabanı bağlantısı başarılı.");
  } catch (error) {
    console.error("❌ Veritabanına bağlanılamadı:", error);
    process.exit(1);
  }
};

// Hem connectDB fonksiyonunu hem de sequelize instance'ını export et
// sequelize'ı modelleri tanımlarken kullanacağız.
export { connectDB, sequelize };
