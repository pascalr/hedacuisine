class SimController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :only_admin!

  #protect_from_forgery only: [] or except: []
  skip_forgery_protection

  def get_state
    render json: {recipes: Recipe.where.not(instructions: [nil, ""])}
  end

  def pull_state
    render json: {current_user: current_user ? current_user.email : "none"}
  end

  def pull_machine
    #data = {}
    @machine = Machine.first
    @foods = Food.all
    #data[:jars] = machine.containers
    #data[:foods] = Food.all
    #render json: data
  end
  
  def push_machine
    ContainerIngredient.destroy_all
    data = JSON.parse request.body.read()
    data["jar_data_list"].each do |jar_data|
      container = Container.find_by(jar_id: jar_data["jar_id"])
      jar_data["ingredients"].each do |ing|
        container.container_ingredients.create!(food_id: ing["food_id"], weight: ing["weight"])
      end
      container.pos_x = jar_data["pos_x"]
      container.pos_y = jar_data["pos_y"]
      container.pos_z = jar_data["pos_z"]
      container.save!
      #jar_data["ingredients"]
    end
    render json: {status: "OK"}
  end

  # The way authentication will work
  # In Godot:
  # A panel asks to login
  # You enter you email and password
  # It calls the get_password_hash URL by giving the email and password.
  # It this method, the email and password is validated and the password_hash is sent to Godot
  # Godot store the password_hash locally
  # Godot can then send the email and the password_hash for every request
  # The issue is that someone with local access can then connect to the website by reading the password_hash file.
  # Maybe a checkbox wheter they want to store the password locally can be checked?
  # If an attacker has access to the application, the user website account is pretty fucked too anyway... I want to be able to modify things in the application too...
  # The best I can do is propably keep user backups?
  def get_password_hash
  end
end
