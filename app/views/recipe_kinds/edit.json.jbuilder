json.foodList Food.all.map {|food| {id: food.id, name: food.name.downcase, url: food_path(food)}}
