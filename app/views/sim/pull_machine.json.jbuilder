json.jars @machine.containers do |jar|

  json.id jar.id
  json.jar_id jar.id
  json.pos_x jar.pos_x
  json.pos_y jar.pos_y
  json.pos_z jar.pos_z
  json.container_format_id jar.container_format_id

  json.ingredients jar.ingredients do |ing|
    json.weight ing.weight
    json.food_id ing.food_id
  end

end  

json.foods @foods do |food|

  json.id food.id
  json.name food.name
  json.density food.density
  json.color food.color
  json.in_pantry food.in_pantry

end

json.weighings @machine.weighings do |weighing|

  json.id weighing.id
  json.weight weighing.weight
  json.food_id weighing.food_id 
  
end
