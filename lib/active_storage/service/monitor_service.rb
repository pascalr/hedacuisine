require "active_support/core_ext/module/delegation"

module ActiveStorage
  # Wraps a service and monitor it's usage.
  # Can be configurated to set a spending budget for a warning or to block when reached.
  
  class Service::MonitorService < Service
    attr_reader :monitored
    attr_accessor :upload_count
    attr_accessor :download_count
    attr_accessor :download_chunk_count
    attr_accessor :exists_count
    attr_accessor :delete_count

    delegate :download, :download_chunk, :exist?, :url,
      :url_for_direct_upload, :headers_for_direct_upload, :path_for, :compose, to: :monitored

    # Stitch together from named services.
    def self.build(monitored:, name:, configurator:, **options) # :nodoc:
      new(
        monitored: configurator.build(monitored)
      ).tap do |service_instance|
        service_instance.name = name
      end
    end

    def initialize(monitored:)
      @monitored = monitored
      # FIXME: Read from last count
      @upload_count = 0
      @download_count = 0
    end

    def upload(key, io, checksum: nil, **options)
      monitored.upload key, io, checksum: checksum, **options
    end

    def delete(key)
      monitored.delete key
    end

    def delete_prefixed(prefix)
      raise "delete_prefixed is not supported by the monitor service yet"
      #monitored.delete_prefixed prefix
    end

    def stats
      {upload_count: @upload_count,
       download_count: @download_count}
    end

    def print_stats
      puts "upload_count: #{@upload_count}"
      puts "download_count: #{@download_count}"
    end

  end
end
