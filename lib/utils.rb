# Colors and their use:
# red: An error
# cyan: A high level command
# yellow: A medium level command
# green: A notification
# blue: A low level command
# magenta: For the body

class String
  # colorization
  def colorize(color_code)
    "\e[#{color_code}m#{self}\e[0m"
  end

  def red
    colorize(31)
  end

  def green
    colorize(32)
  end

  def yellow
    colorize(33)
  end

  def blue
    colorize(34)
  end

  def magenta
    colorize(35)
  end

  def cyan
    colorize(36)
  end
end


def log(colored, color = :blue)
  nb = case color
       when :black then 30
       when :red then 31
       when :green then 32
       when :yellow then 33
       when :blue then 34
       when :magenta then 35
       when :cyan then 36
       when :white then 37
       else 0
       end
  puts "\e[1;#{nb}m#{colored}\e[0m"
end

def check_log_depth
  if $check_log_depth
    depth = 0
    caller.each do |c|
      return depth-3 unless (c =~ /`start_log_depth'/).nil?
      depth += 1
    end
  end
  nil
end

def debugger_after(cmd_nb)
  debugger if $subcommand_nb >= cmd_nb
end

# Usage: log_func binding
def log_func(caller_binding)

  depth = check_log_depth
  depth_str = depth ? "-" * depth * 2 : nil

  method_name = caller[0].scan(/`([^']*)'/).first.first

  args = method(method_name).parameters.map { |arg| arg[1].to_s }
  args_str = args.map { |arg| "#{arg}: #{(caller_binding.local_variable_get(arg))}" }.join(', ')

  str0 = "#{method_name}(#{args_str})"
  str = "#{depth_str}#{str0}"
  if $check_log_depth
    puts "#{$subcommand_nb}: #{str}"
    debugger if $break_subcommand_nb and $subcommand_nb == $break_subcommand_nb
    $subcommands << SubCommand.new(depth: depth, nb: $subcommand_nb, command: str0)
    $subcommand_nb += 1
  else
    puts str
  end
end

# Usage:
# start_log_depth do
#   ...
# end
def start_log_depth
  $check_log_depth = true
  $subcommand_nb = 0 unless $subcommand_nb # FIXME: Reset subcommand_nb at new recipe
  $subcommands = [] unless $subcommands # FIXME: Reset subcommands at new recipe
  yield
  $check_log_depth = false
end

class PolarCoord
  attr_accessor :h, :y, :t, :a, :b, :r
  def initialize(h=nil, y=nil, t=nil, a=nil, b=nil, r=nil)
    @h = h; @y = y; @t = t; @a = a; @b = b; @r = r
  end
  def angle
    @a+@t
  end
  #def to_s
  #  to_json
  #end
  def to_s
    "#{[@h, @y, @t, @a, @b, @r].map {|s| s.nil? ? '' : format("%.2f", s) }.join(', ')}"
  end
  def ==(o)
    o.class == self.class && o.elements == elements
  end
  alias_method :eql?, :==
  def hash
    elements.hash
  end
  def copy(coord)
    @h = coord.h; @y = coord.y; @t = coord.t; @a = coord.a; @b = coord.b; @r = coord.r 
    self
  end
  def clear
    @h = nil; @y = nil; @t = nil; @a = nil; @b = nil; @r = nil
    self
  end
  def add(coord)
    @h += coord.h if coord.h
    @y += coord.y if coord.y
    @t += coord.t if coord.t
    @a += coord.a if coord.a
    @b += coord.b if coord.b
    @r += coord.r if coord.r
    self
  end
  def sub(coord)
    @h -= coord.h if coord.h
    @y -= coord.y if coord.y
    @t -= coord.t if coord.t
    @a -= coord.a if coord.a
    @b -= coord.b if coord.b
    @r -= coord.r if coord.r
    self
  end
  def multiply_scalar(s)
    @h *= s unless @h.nil? 
    @y *= s unless @y.nil?
    @t *= s unless @t.nil?
    @a *= s unless @a.nil?
    @b *= s unless @b.nil?
    @r *= s unless @r.nil?
    self
  end
  def elements
    [@h, @y, @t, @a, @b, @r]
  end
end
class UserCoord
  attr_accessor :x, :y, :z, :b, :angle
  def initialize(x,y,z,angle=nil,b=nil,default=nil)
    @x = x.to_f; @y = y.to_f; @z = z.to_f;
    if default
      @angle = angle.nil? ? default.angle : angle
      @b = b.nil? ? default.b : b
    else
      @angle = angle unless angle.nil?
      @b = b.to_f unless b.nil?
    end
  end
  def add(coord)
    @x += coord.x if coord.x
    @y += coord.y if coord.y
    @z += coord.z if coord.z
    @angle += coord.angle if coord.angle
    @b += coord.b if coord.b
    self
  end
  def sub(coord)
    @x -= coord.x if coord.x
    @y -= coord.y if coord.y
    @z -= coord.z if coord.z
    @angle -= coord.angle if coord.angle
    @b -= coord.b if coord.b
    self
  end
  def elements
    [@x, @y, @z, @angle, @b]
  end
  def position
    @position ||= Mittsu::Vector3.new
    @position.set(@x, @y, @z)
  end
  def to_s
    "{x: #{@x}, y: #{@y}, z: #{@z}, angle: #{@angle}, b: #{@b}}"
  end
  def ==(o)
    o.class == self.class && o.elements == elements
  end
  alias_method :eql?, :==
  def hash
    elements.hash
  end
end

def pp_method_signature(method)
  ps = method.parameters.map {|opt, name|"#{opt == :opt ? "*" : ""}#{name}"}
  "#{method.name}(#{ps.join(", ")})"
end

ParsedCommand = Struct.new(:command, :args) do
  def to_s
    "#{command} #{args.join(', ')}"
  end
end

module Utils

  def module_has_command?(modul, command)
    cmd = command.is_a?(ParsedCommand) ? command.command : command
    modul.public_instance_methods.include? cmd
  end

  def command_error(modul, parsed_command)
    return "Error module does not have command #{parsed_command.command}." unless module_has_command?(modul, parsed_command)
    m = modul.public_instance_method(parsed_command.command)
    min_args = m.parameters.map(&:first).select {|p| p == :req}.size
    max_args = m.parameters.size
    if parsed_command.args.size < min_args or parsed_command.args.size > max_args
      return ("Wrong number of arguments for #{parsed_command.command}. "+
              "Expected between #{min_args} and #{max_args}"+
              ", but got #{parsed_command.args.size}. Signature = #{pp_method_signature(m)}")
    end
    nil
  end

  def execute_command(modul, command)
    puts "Executing instruction #{command}".green
    return if command.nil?
    error = command_error(modul, command)
    raise error unless error.blank?
    m = modul.public_instance_method(command.command)
    start_log_depth do
      m.bind_call(self, *command.args)
    end
    update_3d if respond_to? :update_3d
  end
  
  def parse_instruction(heda, sentence)
    # FIXME: Parse comments correctly, they are not only at the beginning.
    nil if sentence.blank? or sentence.start_with?("#")
    words = sentence.split(' ', 2)
    cmd = words[0].to_sym
    args = (words[1] || '').split(',').map(&:strip).map {|a| parse_arg(heda, a)}
    ParsedCommand.new(cmd, args)
  end

  def parse_instructions(heda, input)
    input.downcase.lines.map(&:strip).map do |sentence|
      next if sentence.blank? or sentence.start_with?("#")
      parse_instruction(heda, sentence)
    end
  end

  private

  def parse_arg(heda, arg)
    return arg.to_i if arg.to_i.to_s == arg
    return arg.to_r if arg.to_r.to_s == arg
    return arg.to_f if arg.to_f.to_s == arg
    return @current_container if arg == "$current_container"
    if arg.start_with?("$")
      name = arg[1..-1]
      heda.physical_objects.each do |obj|
        return obj if obj.name == name
      end
      raise "Parse error. Missing object #{arg}" # FIXME: Should yield instead of raise
    end
    return arg
  end
end
