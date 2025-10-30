import User from "./UserModel.js";
import Files from "./FileModel.js"; // Model dosyanızın adı 'FilesModel.js' ise
import Category from "./CategoryModel.js";
import StarredCategory from "./StarredCategoryModel.js";
/*  
  1️⃣ User - Files
  Bir kullanıcı birçok dosya yükleyebilir.
  Her dosya bir kullanıcıya aittir.
*/
User.hasMany(Files, {
  foreignKey: "user_id",
  as: "files",
});

Files.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/*  
  2️⃣ Category - Files
  Bir klasörde birden fazla dosya olabilir.
  Her dosya bir klasöre aittir.
*/
Category.hasMany(Files, {
  foreignKey: "category_id",
  as: "files",
});

Files.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

/*  
  3️⃣ User - StarredCategory
  Bir kullanıcı birçok klasörü yıldızlayabilir.
  Her yıldız kaydı bir kullanıcıya ve bir klasöre aittir.
*/
User.hasMany(StarredCategory, {
  foreignKey: "user_id",
  as: "starredFolders",
});

StarredCategory.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Category.hasMany(StarredCategory, {
  foreignKey: "folder_id",
  as: "stars",
});

StarredCategory.belongsTo(Category, {
  foreignKey: "folder_id",
  as: "folder",
});
