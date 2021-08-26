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

ActiveRecord::Schema.define(version: 2021_08_25_204929) do

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
    t.float "diameter"
    t.float "height_with_lid"
    t.float "lid_height"
    t.float "max_content_height"
    t.float "body_weight"
    t.float "lid_weight"
    t.float "volume"
    t.string "icon"
  end

  create_table "container_ingredients", force: :cascade do |t|
    t.bigint "container_id", null: false
    t.bigint "food_id", null: false
    t.float "weight"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["container_id"], name: "index_container_ingredients_on_container_id"
    t.index ["food_id"], name: "index_container_ingredients_on_food_id"
  end

  create_table "container_quantities", force: :cascade do |t|
    t.bigint "container_format_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "machine_food_id"
    t.integer "full_qty_quarters"
    t.integer "grocery_qty_quarters"
    t.index ["container_format_id"], name: "index_container_quantities_on_container_format_id"
  end

  create_table "containers", force: :cascade do |t|
    t.bigint "container_format_id", null: false
    t.bigint "machine_id", null: false
    t.integer "jar_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "pos_x"
    t.float "pos_y"
    t.float "pos_z"
    t.integer "food_id"
    t.index ["container_format_id"], name: "index_containers_on_container_format_id"
    t.index ["machine_id"], name: "index_containers_on_machine_id"
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

  create_table "food_tag_items", force: :cascade do |t|
    t.bigint "food_tag_id", null: false
    t.bigint "food_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["food_id"], name: "index_food_tag_items_on_food_id"
    t.index ["food_tag_id"], name: "index_food_tag_items_on_food_tag_id"
  end

  create_table "food_tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.integer "food_tag_id"
  end

  create_table "grocery_items", force: :cascade do |t|
    t.string "description"
    t.bigint "machine_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["machine_id"], name: "index_grocery_items_on_machine_id"
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
    t.integer "nb"
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

  create_table "machine_foods", force: :cascade do |t|
    t.bigint "machine_id", null: false
    t.bigint "food_id", null: false
    t.float "grocery_threshold"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "full_weight"
    t.float "current_weight"
    t.string "manual_grocery_threshold"
    t.string "manual_full_weight"
    t.index ["food_id"], name: "index_machine_foods_on_food_id"
    t.index ["machine_id"], name: "index_machine_foods_on_machine_id"
  end

  create_table "machine_users", force: :cascade do |t|
    t.bigint "machine_id", null: false
    t.bigint "user_id", null: false
    t.string "nickname"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["machine_id"], name: "index_machine_users_on_machine_id"
    t.index ["user_id"], name: "index_machine_users_on_user_id"
  end

  create_table "machines", force: :cascade do |t|
    t.string "name"
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

  create_table "missing_translations", force: :cascade do |t|
    t.string "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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

  create_table "recipe_ingredients", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.bigint "food_id", null: false
    t.float "quantity"
    t.bigint "unit_id"
    t.integer "item_nb"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["food_id"], name: "index_recipe_ingredients_on_food_id"
    t.index ["recipe_id"], name: "index_recipe_ingredients_on_recipe_id"
    t.index ["unit_id"], name: "index_recipe_ingredients_on_unit_id"
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

  create_table "recipe_steps", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.bigint "step_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["recipe_id"], name: "index_recipe_steps_on_recipe_id"
    t.index ["step_id"], name: "index_recipe_steps_on_step_id"
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
    t.text "complete_instructions"
    t.integer "image_id"
    t.integer "preparation_time"
    t.integer "cooking_time"
    t.integer "servings_quantity"
    t.string "servings_name"
  end

  create_table "similar_recipes", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.integer "similar_recipe_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["recipe_id"], name: "index_similar_recipes_on_recipe_id"
  end

  create_table "steps", force: :cascade do |t|
    t.string "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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

  create_table "user_recipe_categories", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_recipe_categories_on_user_id"
  end

  create_table "user_recipes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "recipe_id", null: false
    t.bigint "user_recipe_category_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["recipe_id"], name: "index_user_recipes_on_recipe_id"
    t.index ["user_id"], name: "index_user_recipes_on_user_id"
    t.index ["user_recipe_category_id"], name: "index_user_recipes_on_user_recipe_category_id"
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

  create_table "weighings", force: :cascade do |t|
    t.bigint "machine_id", null: false
    t.bigint "food_id", null: false
    t.float "weight"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["food_id"], name: "index_weighings_on_food_id"
    t.index ["machine_id"], name: "index_weighings_on_machine_id"
  end

  add_foreign_key "categories", "menus"
  add_foreign_key "container_ingredients", "containers"
  add_foreign_key "container_ingredients", "foods"
  add_foreign_key "container_quantities", "container_formats"
  add_foreign_key "containers", "container_formats"
  add_foreign_key "containers", "machines"
  add_foreign_key "descriptions", "languages"
  add_foreign_key "favorite_menus", "menus"
  add_foreign_key "favorite_menus", "users"
  add_foreign_key "food_preferences", "foods"
  add_foreign_key "food_preferences", "users"
  add_foreign_key "food_recipes", "foods"
  add_foreign_key "food_recipes", "recipes"
  add_foreign_key "food_tag_items", "food_tags"
  add_foreign_key "food_tag_items", "foods"
  add_foreign_key "grocery_items", "machines"
  add_foreign_key "ingredients", "foods"
  add_foreign_key "items", "menus"
  add_foreign_key "items", "recipes"
  add_foreign_key "machine_foods", "foods"
  add_foreign_key "machine_foods", "machines"
  add_foreign_key "machine_users", "machines"
  add_foreign_key "machine_users", "users"
  add_foreign_key "recipe_comments", "recipes"
  add_foreign_key "recipe_comments", "users"
  add_foreign_key "recipe_ingredients", "foods"
  add_foreign_key "recipe_ingredients", "recipes"
  add_foreign_key "recipe_ingredients", "units"
  add_foreign_key "recipe_ratings", "recipes"
  add_foreign_key "recipe_ratings", "users"
  add_foreign_key "recipe_steps", "recipes"
  add_foreign_key "recipe_steps", "steps"
  add_foreign_key "similar_recipes", "recipes"
  add_foreign_key "tasks", "users"
  add_foreign_key "unit_system_items", "unit_systems"
  add_foreign_key "unit_system_items", "units"
  add_foreign_key "units", "languages"
  add_foreign_key "user_recipe_categories", "users"
  add_foreign_key "user_recipes", "recipes"
  add_foreign_key "user_recipes", "user_recipe_categories"
  add_foreign_key "user_recipes", "users"
  add_foreign_key "weighings", "foods"
  add_foreign_key "weighings", "machines"
end
