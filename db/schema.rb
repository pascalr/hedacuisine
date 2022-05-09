# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_05_09_213928) do
  create_table "accounts", force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", limit: 255, default: "", null: false
    t.string "reset_password_token", limit: 255
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "admin"
    t.index ["email"], name: "index_accounts_on_email", unique: true
    t.index ["reset_password_token"], name: "index_accounts_on_reset_password_token", unique: true
  end

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.text "body"
    t.string "record_type", limit: 255, null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.string "record_type", limit: 255, null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", limit: 255, null: false
    t.string "filename", limit: 255, null: false
    t.string "content_type", limit: 255
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.string "service_name", limit: 255, null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", limit: 255, null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "articles", force: :cascade do |t|
    t.string "name", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.text "intro"
    t.boolean "is_public"
    t.text "content"
    t.text "json"
    t.text "html"
  end

  create_table "book_formats", force: :cascade do |t|
    t.string "name", limit: 255
    t.float "page_width_mm"
    t.float "page_height_mm"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "book_recipes", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.bigint "book_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "position"
    t.integer "book_section_id"
    t.index ["book_id"], name: "index_book_recipes_on_book_id"
    t.index ["recipe_id"], name: "index_book_recipes_on_recipe_id"
  end

  create_table "book_sections", force: :cascade do |t|
    t.string "name", limit: 255
    t.bigint "book_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "before_recipe_at"
    t.integer "position"
    t.index ["book_id"], name: "index_book_sections_on_book_id"
  end

  create_table "books", force: :cascade do |t|
    t.string "name", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "user_id", null: false
    t.integer "theme_id"
    t.boolean "is_public"
    t.boolean "is_featured"
    t.text "json"
    t.text "html"
    t.integer "book_format_id"
    t.integer "front_page_image_id"
    t.integer "front_page_text_color"
    t.boolean "hide_front_page_text"
    t.integer "background_color"
    t.string "description_json", limit: 255
    t.string "description_html", limit: 255
    t.index ["user_id"], name: "index_books_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", limit: 255
    t.bigint "menu_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["menu_id"], name: "index_categories_on_menu_id"
  end

  create_table "container_formats", force: :cascade do |t|
    t.string "name", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.float "diameter"
    t.float "height_with_lid"
    t.float "lid_height"
    t.float "max_content_height"
    t.float "body_weight"
    t.float "lid_weight"
    t.float "volume"
    t.string "icon", limit: 255
  end

  create_table "container_ingredients", force: :cascade do |t|
    t.bigint "container_id", null: false
    t.bigint "food_id", null: false
    t.float "weight"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["container_id"], name: "index_container_ingredients_on_container_id"
    t.index ["food_id"], name: "index_container_ingredients_on_food_id"
  end

  create_table "container_quantities", force: :cascade do |t|
    t.bigint "container_format_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "machine_food_id"
    t.integer "full_qty_quarters"
    t.integer "grocery_qty_quarters"
    t.index ["container_format_id"], name: "index_container_quantities_on_container_format_id"
  end

  create_table "containers", force: :cascade do |t|
    t.bigint "container_format_id", null: false
    t.bigint "machine_id", null: false
    t.integer "jar_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
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
    t.string "described_type", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["language_id"], name: "index_descriptions_on_language_id"
  end

  create_table "english_expressions", force: :cascade do |t|
    t.string "singular", limit: 255
    t.string "plural", limit: 255
    t.bigint "expression_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["expression_id"], name: "index_english_expressions_on_expression_id"
  end

  create_table "expressions", force: :cascade do |t|
    t.string "default", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "favorite_menus", force: :cascade do |t|
    t.bigint "menu_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["menu_id"], name: "index_favorite_menus_on_menu_id"
    t.index ["user_id"], name: "index_favorite_menus_on_user_id"
  end

  create_table "favorite_recipes", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_favorite_recipes_on_recipe_id"
    t.index ["user_id"], name: "index_favorite_recipes_on_user_id"
  end

  create_table "filtered_recipes", force: :cascade do |t|
    t.integer "filterable_id"
    t.string "filterable_type", limit: 255
    t.boolean "match"
    t.bigint "recipe_filter_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_filter_id"], name: "index_filtered_recipes_on_recipe_filter_id"
  end

  create_table "food_preferences", force: :cascade do |t|
    t.bigint "food_id", null: false
    t.bigint "user_id", null: false
    t.integer "preference"
    t.integer "availability"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "container_format_id"
    t.index ["food_id"], name: "index_food_preferences_on_food_id"
    t.index ["user_id"], name: "index_food_preferences_on_user_id"
  end

  create_table "food_recipes", force: :cascade do |t|
    t.bigint "food_id", null: false
    t.bigint "recipe_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["food_id"], name: "index_food_recipes_on_food_id"
    t.index ["recipe_id"], name: "index_food_recipes_on_recipe_id"
  end

  create_table "food_substitutions", force: :cascade do |t|
    t.bigint "food_id", null: false
    t.integer "substitute_id", null: false
    t.float "ratio"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "food_raw_quantity", limit: 255
    t.string "substitute_raw_quantity", limit: 255
    t.index ["food_id"], name: "index_food_substitutions_on_food_id"
  end

  create_table "food_tag_items", force: :cascade do |t|
    t.bigint "food_tag_id", null: false
    t.bigint "food_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["food_id"], name: "index_food_tag_items_on_food_id"
    t.index ["food_tag_id"], name: "index_food_tag_items_on_food_tag_id"
  end

  create_table "food_tags", force: :cascade do |t|
    t.string "name", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "foods", force: :cascade do |t|
    t.string "name", limit: 255
    t.float "density"
    t.float "unit_weight"
    t.integer "color"
    t.boolean "is_liquid"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "plural", limit: 255
    t.boolean "in_pantry"
    t.integer "food_tag_id"
    t.integer "expression_id"
    t.boolean "is_public"
  end

  create_table "french_expressions", force: :cascade do |t|
    t.string "singular", limit: 255
    t.string "plural", limit: 255
    t.boolean "contract_preposition"
    t.bigint "expression_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["expression_id"], name: "index_french_expressions_on_expression_id"
  end

  create_table "grocery_items", force: :cascade do |t|
    t.string "description", limit: 255
    t.bigint "machine_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["machine_id"], name: "index_grocery_items_on_machine_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "images", force: :cascade do |t|
    t.string "filename", limit: 255
    t.float "zoom"
    t.float "left"
    t.float "top"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "author", limit: 255
    t.string "source", limit: 255
    t.string "description", limit: 255
    t.string "extension", limit: 255
    t.boolean "is_user_author"
  end

  create_table "ingredient_sections", force: :cascade do |t|
    t.string "name", limit: 255
    t.bigint "recipe_id", null: false
    t.integer "before_ing_nb"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_ingredient_sections_on_recipe_id"
  end

  create_table "items", force: :cascade do |t|
    t.integer "category_id"
    t.bigint "recipe_id", null: false
    t.bigint "menu_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["menu_id"], name: "index_items_on_menu_id"
    t.index ["recipe_id"], name: "index_items_on_recipe_id"
  end

  create_table "kinds", force: :cascade do |t|
    t.string "name", limit: 255
    t.integer "image_id"
    t.text "description"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "kind_id"
  end

  create_table "languages", force: :cascade do |t|
    t.string "name", limit: 255
    t.string "locale", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "listings", force: :cascade do |t|
    t.string "name", limit: 255
    t.integer "order"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "machine_foods", force: :cascade do |t|
    t.bigint "machine_id", null: false
    t.bigint "food_id", null: false
    t.float "grocery_threshold"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.float "full_weight"
    t.float "current_weight"
    t.string "manual_grocery_threshold", limit: 255
    t.string "manual_full_weight", limit: 255
    t.index ["food_id"], name: "index_machine_foods_on_food_id"
    t.index ["machine_id"], name: "index_machine_foods_on_machine_id"
  end

  create_table "machine_users", force: :cascade do |t|
    t.bigint "machine_id", null: false
    t.bigint "user_id", null: false
    t.string "nickname", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["machine_id"], name: "index_machine_users_on_machine_id"
    t.index ["user_id"], name: "index_machine_users_on_user_id"
  end

  create_table "machines", force: :cascade do |t|
    t.string "name", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "meals", force: :cascade do |t|
    t.bigint "machine_id", null: false
    t.bigint "recipe_id", null: false
    t.datetime "start_time", precision: nil
    t.datetime "end_time", precision: nil
    t.boolean "is_done"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["machine_id"], name: "index_meals_on_machine_id"
    t.index ["recipe_id"], name: "index_meals_on_recipe_id"
  end

  create_table "menus", force: :cascade do |t|
    t.string "name", limit: 255
    t.boolean "is_cookable"
    t.integer "user_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "parent_id"
    t.integer "listing_id"
    t.string "emoji", limit: 255
  end

  create_table "missing_translations", force: :cascade do |t|
    t.string "content", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "orders", force: :cascade do |t|
    t.integer "position"
    t.integer "orderable_id"
    t.string "orderable_type", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "page_texts", force: :cascade do |t|
    t.bigint "page_id", null: false
    t.text "json"
    t.text "html"
    t.float "x_mm"
    t.float "y_mm"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["page_id"], name: "index_page_texts_on_page_id"
  end

  create_table "pages", force: :cascade do |t|
    t.bigint "book_id", null: false
    t.integer "page_nb"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["book_id"], name: "index_pages_on_book_id"
  end

  create_table "recipe_comments", force: :cascade do |t|
    t.text "content"
    t.bigint "recipe_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_recipe_comments_on_recipe_id"
    t.index ["user_id"], name: "index_recipe_comments_on_user_id"
  end

  create_table "recipe_filters", force: :cascade do |t|
    t.string "name", limit: 255
    t.integer "image_id"
    t.integer "user_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "image_src", limit: 255
  end

  create_table "recipe_ingredients", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.bigint "food_id"
    t.float "quantity"
    t.bigint "unit_id"
    t.integer "item_nb"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.float "weight"
    t.string "comment", limit: 255
    t.string "raw", limit: 255
    t.string "raw_food", limit: 255
    t.text "comment_json"
    t.text "comment_html"
    t.index ["food_id"], name: "index_recipe_ingredients_on_food_id"
    t.index ["recipe_id"], name: "index_recipe_ingredients_on_recipe_id"
    t.index ["unit_id"], name: "index_recipe_ingredients_on_unit_id"
  end

  create_table "recipe_kinds", force: :cascade do |t|
    t.string "name", limit: 255
    t.text "description"
    t.integer "image_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "kind_id"
    t.text "description_json"
    t.text "description_html"
  end

  create_table "recipe_notes", force: :cascade do |t|
    t.string "content", limit: 255
    t.integer "item_nb"
    t.bigint "recipe_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.text "json"
    t.text "html"
    t.index ["recipe_id"], name: "index_recipe_notes_on_recipe_id"
  end

  create_table "recipe_ratings", force: :cascade do |t|
    t.float "rating"
    t.bigint "recipe_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_recipe_ratings_on_recipe_id"
    t.index ["user_id"], name: "index_recipe_ratings_on_user_id"
  end

  create_table "recipe_steps", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.bigint "step_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_recipe_steps_on_recipe_id"
    t.index ["step_id"], name: "index_recipe_steps_on_step_id"
  end

  create_table "recipe_tools", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.bigint "tool_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_recipe_tools_on_recipe_id"
    t.index ["tool_id"], name: "index_recipe_tools_on_tool_id"
  end

  create_table "recipes", force: :cascade do |t|
    t.string "name", limit: 255
    t.string "source", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "user_id"
    t.text "instructions"
    t.integer "group_id"
    t.string "version_name", limit: 255
    t.text "complete_instructions"
    t.integer "image_id"
    t.integer "preparation_time"
    t.integer "cooking_time"
    t.integer "servings_quantity"
    t.string "servings_name", limit: 255
    t.integer "total_time"
    t.boolean "is_public"
    t.boolean "is_gluten_free"
    t.boolean "is_vegetarian"
    t.boolean "is_vegan"
    t.integer "base_recipe_id"
    t.text "description"
    t.integer "main_ingredient_id"
    t.integer "version_nb"
    t.integer "kind_id"
    t.text "content"
    t.text "text"
    t.integer "recipe_kind_id"
    t.boolean "mods_unpublished"
    t.text "json"
    t.text "html"
    t.boolean "use_personalised_image"
  end

  create_table "references", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.string "raw", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_references_on_recipe_id"
  end

  create_table "regions", force: :cascade do |t|
    t.string "name", limit: 255
    t.string "code", limit: 255
    t.string "locale", limit: 255
    t.bigint "language_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["language_id"], name: "index_regions_on_language_id"
  end

  create_table "sections", force: :cascade do |t|
    t.bigint "article_id", null: false
    t.text "content"
    t.integer "position"
    t.string "title", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["article_id"], name: "index_sections_on_article_id"
  end

  create_table "similar_recipes", force: :cascade do |t|
    t.bigint "recipe_id", null: false
    t.integer "similar_recipe_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_similar_recipes_on_recipe_id"
  end

  create_table "steps", force: :cascade do |t|
    t.string "content", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "suggestions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "recipe_id"
    t.integer "recipe_kind_id"
    t.integer "filter_id"
    t.integer "skip_count"
    t.integer "selected_count"
    t.float "score"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "filtered"
    t.index ["user_id"], name: "index_suggestions_on_user_id"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title", limit: 255
    t.text "description"
    t.bigint "user_id", null: false
    t.float "estimated_hours"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "frequency"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "themes", force: :cascade do |t|
    t.string "name", limit: 255
    t.integer "background_color"
    t.integer "text_color"
    t.string "font_name", limit: 255
    t.integer "page_separator_color"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "inverted_background_color"
    t.integer "inverted_text_color"
    t.integer "link_color"
    t.integer "link_missing"
    t.integer "front_page_image_id"
    t.integer "book_format_id"
  end

  create_table "tools", force: :cascade do |t|
    t.string "name", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "translations", force: :cascade do |t|
    t.integer "from"
    t.integer "to"
    t.string "original", limit: 255
    t.string "translated", limit: 255
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "unit_system_items", force: :cascade do |t|
    t.bigint "unit_id", null: false
    t.bigint "unit_system_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["unit_id"], name: "index_unit_system_items_on_unit_id"
    t.index ["unit_system_id"], name: "index_unit_system_items_on_unit_system_id"
  end

  create_table "unit_systems", force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "name", limit: 255
  end

  create_table "units", force: :cascade do |t|
    t.string "name", limit: 255
    t.float "value"
    t.boolean "is_weight"
    t.boolean "is_volume"
    t.boolean "show_fraction"
    t.bigint "language_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "region_id"
    t.index ["language_id"], name: "index_units_on_language_id"
  end

  create_table "user_recipe_categories", force: :cascade do |t|
    t.string "name", limit: 255
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["user_id"], name: "index_user_recipe_categories_on_user_id"
  end

  create_table "user_recipes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "recipe_id", null: false
    t.bigint "user_recipe_category_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["recipe_id"], name: "index_user_recipes_on_recipe_id"
    t.index ["user_id"], name: "index_user_recipes_on_user_id"
    t.index ["user_recipe_category_id"], name: "index_user_recipes_on_user_recipe_category_id"
  end

  create_table "user_siblings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "sibling_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["user_id"], name: "index_user_siblings_on_user_id"
  end

  create_table "user_tags", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "position"
    t.index ["user_id"], name: "index_user_tags_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", limit: 255, default: "", null: false
    t.string "encrypted_password", limit: 255, default: "", null: false
    t.string "reset_password_token", limit: 255
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.boolean "admin"
    t.string "name", limit: 255
    t.integer "account_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "weighings", force: :cascade do |t|
    t.bigint "machine_id", null: false
    t.bigint "food_id", null: false
    t.float "weight"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["food_id"], name: "index_weighings_on_food_id"
    t.index ["machine_id"], name: "index_weighings_on_machine_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "book_recipes", "books"
  add_foreign_key "book_recipes", "recipes"
  add_foreign_key "book_sections", "books"
  add_foreign_key "books", "users"
  add_foreign_key "categories", "menus"
  add_foreign_key "container_ingredients", "containers"
  add_foreign_key "container_ingredients", "foods"
  add_foreign_key "container_quantities", "container_formats"
  add_foreign_key "containers", "container_formats"
  add_foreign_key "containers", "machines"
  add_foreign_key "descriptions", "languages"
  add_foreign_key "english_expressions", "expressions"
  add_foreign_key "favorite_menus", "menus"
  add_foreign_key "favorite_menus", "users"
  add_foreign_key "favorite_recipes", "recipes"
  add_foreign_key "favorite_recipes", "users"
  add_foreign_key "filtered_recipes", "recipe_filters"
  add_foreign_key "food_preferences", "foods"
  add_foreign_key "food_preferences", "users"
  add_foreign_key "food_recipes", "foods"
  add_foreign_key "food_recipes", "recipes"
  add_foreign_key "food_substitutions", "foods"
  add_foreign_key "food_tag_items", "food_tags"
  add_foreign_key "food_tag_items", "foods"
  add_foreign_key "french_expressions", "expressions"
  add_foreign_key "grocery_items", "machines"
  add_foreign_key "ingredient_sections", "recipes"
  add_foreign_key "items", "menus"
  add_foreign_key "items", "recipes"
  add_foreign_key "machine_foods", "foods"
  add_foreign_key "machine_foods", "machines"
  add_foreign_key "machine_users", "machines"
  add_foreign_key "machine_users", "users"
  add_foreign_key "meals", "machines"
  add_foreign_key "meals", "recipes"
  add_foreign_key "page_texts", "pages"
  add_foreign_key "pages", "books"
  add_foreign_key "recipe_comments", "recipes"
  add_foreign_key "recipe_comments", "users"
  add_foreign_key "recipe_ingredients", "foods"
  add_foreign_key "recipe_ingredients", "recipes"
  add_foreign_key "recipe_ingredients", "units"
  add_foreign_key "recipe_notes", "recipes"
  add_foreign_key "recipe_ratings", "recipes"
  add_foreign_key "recipe_ratings", "users"
  add_foreign_key "recipe_steps", "recipes"
  add_foreign_key "recipe_steps", "steps"
  add_foreign_key "recipe_tools", "recipes"
  add_foreign_key "recipe_tools", "tools"
  add_foreign_key "references", "recipes"
  add_foreign_key "regions", "languages"
  add_foreign_key "sections", "articles"
  add_foreign_key "similar_recipes", "recipes"
  add_foreign_key "suggestions", "users"
  add_foreign_key "tasks", "users"
  add_foreign_key "unit_system_items", "unit_systems"
  add_foreign_key "unit_system_items", "units"
  add_foreign_key "units", "languages"
  add_foreign_key "user_recipe_categories", "users"
  add_foreign_key "user_recipes", "recipes"
  add_foreign_key "user_recipes", "user_recipe_categories"
  add_foreign_key "user_recipes", "users"
  add_foreign_key "user_siblings", "users"
  add_foreign_key "user_tags", "users"
  add_foreign_key "weighings", "foods"
  add_foreign_key "weighings", "machines"
end
