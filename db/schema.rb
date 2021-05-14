# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_05_14_165024) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.bigint "menu_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["menu_id"], name: "index_categories_on_menu_id"
  end

  create_table "container_formats", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "descriptions", force: :cascade do |t|
    t.text "content"
    t.bigint "language_id", null: false
    t.integer "described_id"
    t.string "described_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["language_id"], name: "index_descriptions_on_language_id"
  end

  create_table "favorite_menus", force: :cascade do |t|
    t.bigint "menu_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["menu_id"], name: "index_favorite_menus_on_menu_id"
    t.index ["user_id"], name: "index_favorite_menus_on_user_id"
  end

  create_table "food_preferences", force: :cascade do |t|
    t.bigint "food_id", null: false
    t.bigint "user_id", null: false
    t.integer "preference"
    t.integer "availability"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "container_format_id"
    t.index ["food_id"], name: "index_food_preferences_on_food_id"
    t.index ["user_id"], name: "index_food_preferences_on_user_id"
  end

  create_table "food_recipes", force: :cascade do |t|
    t.bigint "food_id", null: false
    t.bigint "recipe_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["food_id"], name: "index_food_recipes_on_food_id"
    t.index ["recipe_id"], name: "index_food_recipes_on_recipe_id"
  end

  create_table "foods", force: :cascade do |t|
    t.string "name"
    t.float "density"
    t.float "unit_weight"
    t.integer "color"
    t.boolean "is_liquid"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "plural"
    t.boolean "in_pantry"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "ingredients", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.bigint "food_id", null: false
    t.float "weight"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "container_nb"
    t.index ["food_id"], name: "index_ingredients_on_food_id"
    t.index ["recipe_id"], name: "index_ingredients_on_recipe_id"
  end

  create_table "items", force: :cascade do |t|
    t.integer "category_id"
    t.bigint "recipe_id", null: false
    t.bigint "menu_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["menu_id"], name: "index_items_on_menu_id"
    t.index ["recipe_id"], name: "index_items_on_recipe_id"
  end

  create_table "languages", force: :cascade do |t|
    t.string "name"
    t.string "locale"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "listings", force: :cascade do |t|
    t.string "name"
    t.integer "order"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "menus", force: :cascade do |t|
    t.string "name"
    t.boolean "is_cookable"
    t.integer "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "parent_id"
    t.integer "listing_id"
    t.string "emoji"
  end

  create_table "recipe_comments", force: :cascade do |t|
    t.text "content"
    t.bigint "recipe_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["recipe_id"], name: "index_recipe_comments_on_recipe_id"
    t.index ["user_id"], name: "index_recipe_comments_on_user_id"
  end

  create_table "recipe_ratings", force: :cascade do |t|
    t.float "rating"
    t.bigint "recipe_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["recipe_id"], name: "index_recipe_ratings_on_recipe_id"
    t.index ["user_id"], name: "index_recipe_ratings_on_user_id"
  end

  create_table "recipes", force: :cascade do |t|
    t.string "name"
    t.string "source"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "user_id"
    t.text "instructions"
    t.integer "group_id"
    t.string "version_name"
  end

  create_table "similar_recipes", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.integer "similar_recipe_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["recipe_id"], name: "index_similar_recipes_on_recipe_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.bigint "user_id", null: false
    t.float "estimated_hours"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "frequency"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "translations", force: :cascade do |t|
    t.integer "from"
    t.integer "to"
    t.string "original"
    t.string "translated"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "unit_system_items", force: :cascade do |t|
    t.bigint "unit_id", null: false
    t.bigint "unit_system_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["unit_id"], name: "index_unit_system_items_on_unit_id"
    t.index ["unit_system_id"], name: "index_unit_system_items_on_unit_system_id"
  end

  create_table "unit_systems", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
  end

  create_table "units", force: :cascade do |t|
    t.string "name"
    t.float "value"
    t.boolean "is_weight"
    t.boolean "is_volume"
    t.boolean "show_fraction"
    t.bigint "language_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["language_id"], name: "index_units_on_language_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "admin"
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "categories", "menus"
  add_foreign_key "descriptions", "languages"
  add_foreign_key "favorite_menus", "menus"
  add_foreign_key "favorite_menus", "users"
  add_foreign_key "food_preferences", "foods"
  add_foreign_key "food_preferences", "users"
  add_foreign_key "food_recipes", "foods"
  add_foreign_key "food_recipes", "recipes"
  add_foreign_key "ingredients", "foods"
  add_foreign_key "items", "menus"
  add_foreign_key "items", "recipes"
  add_foreign_key "recipe_comments", "recipes"
  add_foreign_key "recipe_comments", "users"
  add_foreign_key "recipe_ratings", "recipes"
  add_foreign_key "recipe_ratings", "users"
  add_foreign_key "similar_recipes", "recipes"
  add_foreign_key "tasks", "users"
  add_foreign_key "unit_system_items", "unit_systems"
  add_foreign_key "unit_system_items", "units"
  add_foreign_key "units", "languages"
end
